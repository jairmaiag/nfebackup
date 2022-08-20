const fs = require("fs");
const { config } = require('dotenv');
const {XMLParser, XMLBuilder, XMLValidator} = require('fast-xml-parser');
config();
const { Base64Encode } = require("base64-stream");
const quotedPrintable = require("quoted-printable");
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
		console.error("Debug do imap:", msg);
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

function findAttachmentParts(structs, attachments) {
	attachments = attachments || [];
	structs.forEach(struct => {
		if (Array.isArray(struct)) {
			findAttachmentParts(struct, attachments);
		} else {
			if (
				struct.disposition && (
					["INLINE", "ATTACHMENT"].indexOf(toUpper(struct.disposition.type)) > -1 ||
					["INLINE", "ATTACHMENT"].indexOf(toUpper(struct.disposition.type)) > -1)
			) {
				attachments.push(struct);
			}
		}

	});
	return attachments;
}

function buildAttMessageFunction(attachment) {
	var filename = attachment.params.name;
	return function (msg, seqno) {
		var prefix = "(#" + seqno + ") ";
		msg.on("body", function (stream, info) {
			//Create a write stream so that we can stream the attachment to file;
			console.log(prefix + "Streaming this attachment to file", filename, info);
			// var writeStream = fs.createWriteStream(filename);
			streamToString(stream).then(result => {
				const context = quotedPrintable.decode(result);
				const parser = new XMLParser();
				const jsonObj = parser.parse(context);
				const cnpj = jsonObj.nfeProc.NFe.infNFe.emit.CNPJ;
				const pasta = `./nFe/${cnpj}`;
				if (!fs.existsSync(pasta)){
					fs.mkdirSync(pasta);
				}
				fs.writeFile(`${pasta}/${filename}`, context, (err) => {
					if (err) throw err;
					console.log("The file has been saved!");
				});
			});
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
					console.log("Message #%d", seqno);

					const prefix = `(# ${seqno}) `;
					msg.on("body", function (stream, info) {
						let buffer = "";
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
						const attachments = findAttachmentParts(attrs.struct);
						console.log(prefix + "Has attachments: %d", attachments.length);
						attachments.forEach(attachment => {
							console.log('attachment =>', attachment);
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
								attachment.type === "text" &&
								attachment.subtype === "xml"
							) {
								console.log(`${prefix} Fetching attachment ${attachment.params.name}`);
								var f = imap.fetch(attrs.uid, {
									//do not use imap.seq.fetch here
									bodies: [attachment.partID],
									struct: true,
								});
								//build function to process attachment message
								f.on("message", buildAttMessageFunction(attachment));
							}
						});
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
