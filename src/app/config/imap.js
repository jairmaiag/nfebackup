const Imap = require("imap");

const {
  buildAttMessageFunction,
  findAttachmentParts,
  formatMesDiaAno,
  isXml,
} = require("../utils");

const imap = new Imap({
  host: process.env.EMAIL_HOST,
  password: process.env.EMAIL_PASSWORD,
  port: process.env.EMAIL_PORT,
  user: process.env.EMAIL_USER,
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
    if (err) throw err;
    const defaultDate = process.env.DEFAULT_DATE;
    const searchDate = formatMesDiaAno(
      new Date(imap.dados.searchDate || defaultDate)
    );

    imap.search(
      [["OR", "UNSEEN", ["SINCE", searchDate]]],
      function (err, results) {
        if (err) throw err;

        const imapFetch = imap.fetch(results, {
          bodies: ["HEADER.FIELDS (FROM TO SUBJECT DATE)"],
          struct: true,
        });

        imapFetch.on("message", function (msg, seqno) {
          msg.on("attributes", function (attrs) {
            const attachments = findAttachmentParts(attrs.struct);

            attachments.forEach((attachment) => {
              if (isXml(attachment)) {
                const fetch = imap.fetch(attrs.uid, {
                  bodies: [attachment.partID],
                  struct: true,
                });
                fetch.on("message", buildAttMessageFunction(attachment));
              }
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
