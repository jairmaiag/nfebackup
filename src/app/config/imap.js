const Imap = require("imap");

const {
  buildAttMessageFunction,
  findAttachmentParts,
  formatMesDiaAno,
  isXml,
} = require("../utils");

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
  imap.openBox("INBOX", false, function (err, box) {
    if (err) throw err;

    const defaultDate = process.env.DEFAULT_DATE;
    const searchDate = formatMesDiaAno(
      new Date(imap._config.searchDate || defaultDate)
    );
    imap.qtdNfe = 0;
    imap.qtdEmail = 0;

    imap.search(
      [["OR", "UNSEEN", ["SINCE", searchDate]]],

      function (err, results) {
        if (err) throw err;

        if (results.length === 0) {
          imap.end();
          return;
        }

        imap.qtdEmail += results.length;
        const imapFetch = imap.fetch(results, {
          bodies: ["HEADER.FIELDS (FROM TO SUBJECT DATE)"],
          struct: true,
        });

        imapFetch.on("message", function (emailMessage, seqno) {
          emailMessage.on("attributes", function (attrs) {
            const attachments = findAttachmentParts(attrs.struct);
            imap.qtdNfe += attachments.length;
            attachments
              .filter(attac => isXml(attac))
              .forEach((attachment) => {
                imap.addFlags(seqno, '\\Deleted');
                const fetch = imap.fetch(attrs.uid, {
                  bodies: [attachment.partID],
                  struct: true,
                });
                fetch.on("message", buildAttMessageFunction(attachment));
              });
          });
        });

        imapFetch.on("error", function (err) {
          console.error("Fetch error: " + err);
        });

        imapFetch.on("end", function () {
          imap.end();
        });
      }
    );
  });
});

module.exports = { imap };
