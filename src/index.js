require('dotenv/config');
const Imap = require("imap");
const imap = require('./app/imapConfig');
const Util = require("./app/Util");

/* Captura da passgem de parâmetros via linha de comando */
const param = process.argv;
if(param.length > 2){
  const modo = param[2];
  if(modo === 'production'){
    process.env.NODE_ENV = 'production';
  }
}


imap.once("ready", function () {
	imap.openBox("INBOX", true, function (err, box) {
		if (err) throw err;

		imap.search(
			[["OR", "UNSEEN", ["SINCE", "April 20, 2022"]]],
			function (err, results) {
				if (err) throw err;

				const f = imap.fetch("*", {
					bodies: ["HEADER.FIELDS (FROM TO SUBJECT DATE)"],
					struct: true,
				});
				f.on("message", function (msg, seqno) {
					// console.log("Message #%d", seqno);

					const prefix = "(#" + seqno + ") ";
					msg.on("body", function (stream, info) {
						let buffer = "";
						stream.on("data", function (chunk) {
							buffer += chunk.toString("utf8");
						});
						stream.once("end", function () {
							// console.log(
							// 	prefix + "Parsed header: %s",
							// 	Imap.parseHeader(buffer)
							// );
						});
					});
					msg.once("attributes", function (attrs) {
						const attachments = Util.findAttachmentParts(attrs.struct);
						attachments.forEach(attachment => {
							if (
								attachment.type === "text" &&
								attachment.subtype === "xml"
							) {
								const fetch = imap.fetch(attrs.uid, {
									bodies: [attachment.partID],
									struct: true,
								});
								fetch.on("message", Util.buildAttMessageFunction(attachment));
							}
							
						});
					});
					msg.once("end", function () {
						// console.log(prefix + "Finished email");
					});
				});
				f.once("error", function (err) {
					console.error("Fetch error: " + err);
				});
				f.once("end", function () {
					// console.log("Done fetching all messages!");
					imap.end();
				});
			}
		);
	});
});

imap.once("error", err => console.error);
imap.once("end", () => console.log("Connection ended"));
imap.connect();