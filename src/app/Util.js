const fs = require("fs");

class Util {
    toUpper(thing) {
        return thing && thing.toUpperCase ? thing.toUpperCase() : thing;
    }
    
    async streamToString(stream) {
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

    findAttachmentParts(struct, attachments) {
        attachments = attachments || [];
        if(struct.length === 0 ) {
            return attachments;
        }
        struct.forEach(struc => {
            if (Array.isArray(struc)) {
                this.findAttachmentParts(struc, attachments);
            }else if(this.validStruct(struc)) {
                attachments.push(struc);
            }
        });
        return attachments;
    }

    buildAttMessageFunction(attachment) {
        const filename = attachment.params.name;
        return function (msg, seqno) {
            const prefix = `(#${seqno}) `;
            msg.on("body", function (stream, info) {
                this.streamToString(stream).then((result) => {
                    fs.writeFile(filename, quotedPrintable.decode(result), (err) => {
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
    
}
module.exports = new Util();