const Util = require("./Util");
const utilDate = require('./util/utilDate');
const Imap = require("imap");
const imap = new Imap({
	user:  process.env.EMAIL,
	password: process.env.SENHA_EMAIL,
	host: process.env.HOST_EMAIL,
	port: process.env.PORT_EMAIL,
	tls: true,
	tlsOptions: {
		rejectUnauthorized: false,
	},
	debug: function (msg) {
		if(process.env.NODE_ENV === 'development'){
			console.error("Debug do imap:", msg);
		}
	},
});

imap.once("ready", function () {
	imap.openBox("INBOX", true, function (err, box) {
		if (err) throw err;
		const searchDate = utilDate.formatMesDiaAno(new Date(imap.dados.searchDate));
		imap.search(
			[["OR", "UNSEEN", ["SINCE", searchDate]]],
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

module.exports = { imap, Imap };