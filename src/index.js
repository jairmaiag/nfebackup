require('dotenv/config');
const imap = require('./app/imapConfig');
const Util = require("./app/Util");

imap.once("ready", function () {
	imap.openBox("INBOX", true, function (err, box) {
		if (err) throw err;

		imap.search(
			[["OR", "UNSEEN", ["SINCE", "April 20, 2022"]]],
			function (err, results) {
				if (err) throw err;

				var f = imap.fetch("*", {
					bodies: ["HEADER.FIELDS (FROM TO SUBJECT DATE)"],
					struct: true,
				});
				f.on("message", function (msg, seqno) {
					// console.log("Message #%d", seqno);
					console.log("Message #%d", seqno);

					var prefix = "(#" + seqno + ") ";
					msg.on("body", function (stream, info) {
						var buffer = "";
						stream.on("data", function (chunk) {
							buffer += chunk.toString("utf8");
						});
						stream.once("end", function () {
							console.log(
								prefix + "Parsed header: %s",
								Imap.parseHeader(buffer)
							);
						});
					});
					msg.once("attributes", function (attrs) {
						const attachments = Util.findAttachmentParts(attrs.struct);
						attachments.forEach(attachment => {
							if (
								attachment.type === "application" &&
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
						console.log(prefix + "Finished email");
					});
				});
				f.once("error", function (err) {
					console.error("Fetch error: " + err);
				});
				f.once("end", function () {
					console.log("Done fetching all messages!");
					imap.end();
				});
			}
		);
	});
});

imap.once("error", err => console.error);
imap.once("end", () => console.log("Connection ended"));
imap.connect();