const fs = require("fs");
const quotedPrintable = require("quoted-printable");

const meses = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function formatMesDiaAno(data) {
  return `${meses[data.getMonth()]} ${data.getDate()}, ${data.getFullYear()}`;
}

function toUpper(thing) {
  return thing && thing.toUpperCase ? thing.toUpperCase() : thing;
}

function isXml(attachment) {
  return (
    (attachment.type === "text" || attachment.type === "application") &&
    attachment.subtype === "xml"
  );
}

function streamToString(stream) {
  const chunks = [];
  return new Promise((resolve, reject) => {
    stream.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    stream.on("error", (err) => reject(err));
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
  });
}

function findAttachmentParts(structs, attachments) {
  attachments = attachments || [];
  structs.forEach((struct) => {
    if (Array.isArray(struct)) {
      findAttachmentParts(struct, attachments);
    } else {
      if (
        struct.disposition &&
        ["INLINE", "ATTACHMENT"].indexOf(toUpper(struct.disposition.type)) > -1
      ) {
        attachments.push(struct);
      }
    }
  });
  return attachments;
}

function buildAttMessageFunction(attachment) {
  const filename = attachment.params.name;
  const chaveNfe = filename.replace(/\D+/g, '');

  return function (msg, seqno) {
    msg.on("body", function (stream, info) {
      streamToString(stream).then((result) => {
        const context = quotedPrintable.decode(result);
        const ano = chaveNfe.substring(2, 4);
        const mes = chaveNfe.substring(4, 6);
        const cnpj = chaveNfe.substring(6, 20);
        let pastaNfe = process.env.DOWNLOAD_FOLDER;
        if (process.env.NODE_ENV == "development") {
          pastaNfe = `${process.env.PWD ? process.env.PWD + "/" : ""
            }${"nfe"}`;
        }
        const pasta = `${pastaNfe}/${cnpj}/emitidas/${ano}/${mes}`;

        if (!fs.existsSync(pasta)) {
          fs.mkdirSync(pasta, { recursive: true });
        }

        fs.writeFile(`${pasta}/${filename}`, context, (err) => {
          if (err) throw err;
        });
      });
    });
  };
}

function validateField(obj) {
  const { host, password, port, user, searchDate } = obj;
  if (!host) {
    return false;
  }
  if (!password) {
    return false;
  }
  if (!port) {
    return false;
  }
  if (!user) {
    return false;
  }
  if (!searchDate) {
    return false;
  }
  return true;
}
function resultValidate(obj) {
  return {
    satusCode: validateField(obj) ? 200 : 404,
    objReturn: {
      mensagem: "Estrutura de campos é inválido, esperado como abaixo:",
      data: {
        searchDate: "2022-01-01T03:00:00.000+00:00",
        host: "host.com.br",
        password: "Senha do email",
        port: 123,
        user: "usuario@host.com.br"
      }
    }
  }
}
const defaultEmail = {
  host: process.env.EMAIL_HOST,
  password: process.env.EMAIL_PASSWORD,
  port: process.env.EMAIL_PORT,
  user: process.env.EMAIL_USER,
  searchDate: process.env.DEFAULT_DATE
}

module.exports = {
  buildAttMessageFunction,
  findAttachmentParts,
  formatMesDiaAno,
  isXml,
  streamToString,
  toUpper,
  validateField,
  resultValidate,
  defaultEmail
};
