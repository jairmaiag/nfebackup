const config = require('dotenv');
config();
var fs = require("fs");
var { Base64Encode } = require("base64-stream");
var quotedPrintable = require("quoted-printable");
var Imap = require("imap");
var imap = new Imap({
	user:  process.env.EMAIL,
	password: process.env.SENHA_EMAIL,
	host: process.env.HOST_EMAIL,
	port: process.env.PORT_EMAIL,
	tls: true,
	debug: function (msg) {
		console.log("Debug do imap:", msg);
	},
});

async function streamToString(stream) {
	const chunks = [];
	return new Promise((resolve, reject) => {
		stream.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
		stream.on("error", (err) => reject(err));
		stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
	});
}

function toUpper(thing) {
	return thing && thing.toUpperCase ? thing.toUpperCase() : thing;
}

function findAttachmentParts(struct, attachments) {
	attachments = attachments || [];
	for (var i = 0, len = struct.length, r; i < len; ++i) {
		if (Array.isArray(struct[i])) {
			findAttachmentParts(struct[i], attachments);
		} else {
			if (
				struct[i].disposition &&
				(["INLINE", "ATTACHMENT"].indexOf(toUpper(struct[i].disposition.type)) >
					-1 ||
					["INLINE", "ATTACHMENT"].indexOf(
						toUpper(struct[i].disposition.type)
					) > -1)
			) {
				attachments.push(struct[i]);
			}
		}
	}
	return attachments;
}

function buildAttMessageFunction(attachment) {
	var filename = attachment.params.name;
	var encoding = attachment.encoding;

	return function (msg, seqno) {
		var prefix = "(#" + seqno + ") ";
		msg.on("body", function (stream, info) {
			//Create a write stream so that we can stream the attachment to file;
			console.log(prefix + "Streaming this attachment to file", filename, info);
			// var writeStream = fs.createWriteStream(filename);
			streamToString(stream).then((result) => {
				fs.writeFile(filename, quotedPrintable.decode(result), (err) => {
					if (err) throw err;
					console.log("The file has been saved!");
				});
			});

			// writeStream.on("finish", function () {
			// 	console.log(prefix + "Done writing to file %s", filename);
			// });

			// //stream.pipe(writeStream); this would write base64 data to the file.
			// //so we decode during streaming using
			// if (toUpper(encoding) === "BASE64") {
			// 	//the stream is base64 encoded, so here the stream is decode on the fly and piped to the write stream (file)
			// 	console.log("Decodificando Base64 =>", filename);
			// 	stream.pipe(new Base64Encode()).pipe(writeStream);
			// } else {
			// 	//here we have none or some other decoding streamed directly to the file which renders it useless probably
			// 	console.log("Decodificando Normal =>", encoding);
			// 	stream.pipe(writeStream);
			// }
		});
		msg.once("end", function () {
			console.log(prefix + "Finished attachment %s", filename);
		});
	};
}

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
