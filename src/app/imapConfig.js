const Util = require("./Util");
const UtilDate = require('./util/utilDate');
const Imap = require("imap");
const imap = new Imap({
	user: process.env.EMAIL,
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
		const dataPadrao = "2022-04-01T03:00:00.000+00:00";
		const searchDate = UtilDate.formatMesDiaAno(new Date(imap.dados.searchDate || dataPadrao));
		imap.search(
			[["OR", "UNSEEN", ["SINCE", searchDate]]],
			function (err, results) {
				if (err) throw err;
				
				const f = imap.fetch("*", {
					bodies: ["HEADER.FIELDS (FROM TO SUBJECT DATE)"],
					struct: true,
				});
				
				f.on("message", function (msg, seqno) {
					msg.once("attributes", function (attrs) {
						const attachments = Util.findAttachmentParts(attrs.struct);
						attachments.forEach(attachment => {
							if (Util.isXml(attachment)) {
								const fetch = imap.fetch(attrs.uid, {
									bodies: [attachment.partID],
									struct: true,
								});
								fetch.on("message", Util.buildAttMessageFunction(attachment));
							}
							
						});
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