const fs = require("fs");
const quotedPrintable = require("quoted-printable");
const { XMLParser } = require('fast-xml-parser');

class Util {
    static toUpper(thing) {
        return thing && thing.toUpperCase ? thing.toUpperCase() : thing;
    }

    static isXml(attachment) {
        return attachment.type === "text" && attachment.subtype === "xml";
    }

    static async streamToString(stream) {
        const chunks = [];
        return new Promise((resolve, reject) => {
            stream.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
            stream.on("error", (err) => reject(err));
            stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
        });
    }

    static findAttachmentParts(structs, attachments) {
        attachments = attachments || [];
        structs.forEach(struct => {
            if (Array.isArray(struct)) {
                Util.findAttachmentParts(struct, attachments);
            } else {
                if (
                    struct.disposition && (["INLINE", "ATTACHMENT"].indexOf(Util.toUpper(struct.disposition.type)) > -1)
                ) {
                    attachments.push(struct);
                }
            }
    
        });
        return attachments;
    }
    
    static buildAttMessageFunction(attachment) {
        const filename = attachment.params.name;
        return function (msg, seqno) {
            msg.on("body", function (stream, info) {
                Util.streamToString(stream).then(result => {
                    const context = quotedPrintable.decode(result);
                    const parser = new XMLParser();
                    const jsonObj = parser.parse(context);
                    const cnpjEmitente = jsonObj.nfeProc.NFe.infNFe.emit.CNPJ;
                    const pastaNfe = `${process.env.PWD}/${process.env.PASTANFE}`;
                    
                    if (!fs.existsSync(pastaNfe)){
                        fs.mkdirSync(pastaNfe);
                    }
                    const pasta = `${pastaNfe}/${cnpjEmitente}`;
                    if (!fs.existsSync(pasta)){
                        fs.mkdirSync(pasta);
                    }
                    fs.writeFile(`${pasta}/${filename}`, context, (err) => {
                        if (err) throw err;
                    });
                });
            });
        };
    }    
}
module.exports = Util;