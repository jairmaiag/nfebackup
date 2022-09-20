import Imap from "imap";
import {
  buildAttMessageFunction,
  findAttachmentParts,
  formatMesDiaAno,
  isXml,
} from "../../app/utils.js";

const imap = new Imap({
  tls: true,
  tlsOptions: {
    rejectUnauthorized: false,
  },
  debug: function (msg) {
    if (process.env.NODE_ENV !== "production") {
      console.debug("Debug do imap:", msg);
    }
  },
});

imap.on("ready", function () {
  imap.openBox("INBOX", true, function (err, box) {
    if (err) {
      console.log("Error WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW");
      // throw err;
    }
    const defaultDate = process.env.DEFAULT_DATE;
    const searchDate = formatMesDiaAno(
      new Date(imap._config.searchDate || defaultDate)
    );
    imap.qtdNfe = 0;
    imap.qtdEmail = 0;
    imap.search(
      [["OR", "UNSEEN", ["SINCE", searchDate]]],
      function (err, results) {
        if (err) {
          console.log("Error XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
          // throw err;
        }

        imap.qtdEmail += results.length;
        const imapFetch = imap.fetch(results, {
          bodies: ["HEADER.FIELDS (FROM TO SUBJECT DATE)"],
          struct: true,
        });

        imapFetch.on("message", function (msg, seqno) {
          msg.on("attributes", function (attrs) {
            const attachments = findAttachmentParts(attrs.struct);
            imap.qtdNfe += attachments.length;
            attachments.forEach((attachment) => {
              if (isXml(attachment)) {
                const fetch = imap.fetch(attrs.uid, {
                  bodies: [attachment.partID],
                  struct: true,
                });
                fetch.on(
                  "message",
                  buildAttMessageFunction(attachment, imap._config.folderName)
                );
              }
            });
          });
        });

        imapFetch.on("error", function (err) {
          console.error(
            "Fetch error DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD: " + err
          );
        });

        imapFetch.on("end", function () {
          imap.end();
        });
      }
    );
  });
});

export default imap;
