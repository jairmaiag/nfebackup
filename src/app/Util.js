const fs = require("fs");
const quotedPrintable = require("quoted-printable");
const { XMLParser } = require('fast-xml-parser');

class Util {
    toUpper(thing) {
        return thing && thing.toUpperCase ? thing.toUpperCase() : thing;
    }
    
    static async streamToString(stream) {
        const chunks = [];
        return new Promise((resolve, reject) => {
            stream.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
            stream.on("error", (err) => reject(err));
            stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
        });
    }
    validStruct(struct) {
        const arrayFiltro = ["INLINE", "ATTACHMENT"];
        if(!struct.disposition){
            return false;
        }
        return arrayFiltro.indexOf(this.toUpper(struct.disposition.type)) > -1;
    }

    findAttachmentParts(structs, attachments) {
        attachments = attachments || [];
        structs.forEach(struct => {
            if (Array.isArray(struct)) {
                this.findAttachmentParts(struct, attachments);
            } else {
                if (
                    struct.disposition && (
                        ["INLINE", "ATTACHMENT"].indexOf(this.toUpper(struct.disposition.type)) > -1 ||
                        ["INLINE", "ATTACHMENT"].indexOf(this.toUpper(struct.disposition.type)) > -1)
                ) {
                    attachments.push(struct);
                }
            }
    
        });
        return attachments;
    }
    buildAttMessageFunction(attachment) {
        const filename = attachment.params.name;
        return function (msg, seqno) {
            const prefix = "(#" + seqno + ") ";
            msg.on("body", function (stream, info) {
                Util.streamToString(stream).then(result => {
                    const context = quotedPrintable.decode(result);
                    const parser = new XMLParser();
                    const jsonObj = parser.parse(context);
                    const cnpjEmitente = jsonObj.nfeProc.NFe.infNFe.emit.CNPJ;
                    const pastaNfe = `${process.env.PWD}/nFe`
                    if (!fs.existsSync(pastaNfe)){
                        fs.mkdirSync(pastaNfe);
                    }
                    const pasta = `${pastaNfe}/${cnpjEmitente}`;
                    if (!fs.existsSync(pasta)){
                        fs.mkdirSync(pasta);
                    }
                    fs.writeFile(`${pasta}/${filename}`, context, (err) => {
                        if (err) throw err;
                        // console.err("The file has been saved!");
                    });
                });
            });
            msg.once("end", function () {
                // console.log(prefix + "Finished attachment %s", filename);
            });
        };
    }    
}
module.exports = new Util();