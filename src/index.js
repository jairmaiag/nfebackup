require('dotenv/config');
const imap = require('./app/imapConfig');

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
						var attachments = findAttachmentParts(attrs.struct);
						console.log(prefix + "Has attachments: %d", attachments.length);
						for (var i = 0, len = attachments.length; i < len; ++i) {
							var attachment = attachments[i];
							/*This is how each attachment looks like {
              partID: '2',
              type: 'application',
              subtype: 'octet-stream',
              params: { name: 'file-name.ext' },
              id: null,
              description: null,
              encoding: 'BASE64',
              size: 44952,
              md5: null,
              disposition: { type: 'ATTACHMENT', params: { filename: 'file-name.ext' } },
              language: null
            }
          */
							//            console.log('attachment',attachment);
							if (
								attachment.type === "application" &&
								attachment.subtype === "xml"
							) {
								console.log(
									prefix + "Fetching attachment %s",
									attachment.params.name
								);
								var f = imap.fetch(attrs.uid, {
									//do not use imap.seq.fetch here
									bodies: [attachment.partID],
									struct: true,
								});
								//build function to process attachment message
								f.on("message", buildAttMessageFunction(attachment));
							}
						}
					});
					msg.once("end", function () {
						console.log(prefix + "Finished email");
					});
				});
				f.once("error", function (err) {
					console.log("Fetch error: " + err);
				});
				f.once("end", function () {
					console.log("Done fetching all messages!");
					imap.end();
				});
			}
		);
	});
});

imap.once("error", function (err) {
	console.log(err);
});

imap.once("end", function () {
	console.log("Connection ended");
});

imap.connect();