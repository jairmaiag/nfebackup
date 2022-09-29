import Imap from "imap";
import {
  buildAttMessageFunction,
  findAttachmentParts,
  formatMesDiaAno,
  isXml,
} from "../../app/utils/utils.js";

export default class IMAPUseCase {
  constructor() {
    this._config = {
      tls: true,
      tlsOptions: { rejectUnauthorized: false },
      debug: function (msg) {
        if (process.env.NODE_ENV !== "production") {
          console.debug("Debug do imap:", msg);
        }
      },
    };
  }

  async handle(objData) {
    await new Promise((resolve, reject) => {
      const imap = new Imap(this._config);
      imap._config = { ...imap._config, ...objData };

      imap.once("ready", () => {
        imap.openBox("INBOX", false, (err, box) => {
          if (err) {
            throw err;
          }
          const defaultDate = process.env.DEFAULT_DATE;
          const searchDate = formatMesDiaAno(
            new Date(imap._config.searchDate || defaultDate)
          );
          imap.quantityNFEDownloaded = 0;
          imap.quantityEmailRead = 0;
          imap.search(
            [["OR", "UNSEEN", ["SINCE", searchDate]]],
            function (err, results) {
              if (err) {
                throw err;
              }

              if (results.length === 0) {
                imap.end();
                return;
              }

              imap.quantityEmailRead += results.length;
              const emailsFetch = imap.fetch(results, {
                bodies: ["HEADER.FIELDS (FROM TO SUBJECT DATE)"],
                struct: true,
              });

              emailsFetch.on("message", function (msg, seqno) {
                msg.on("attributes", function (attrs) {
                  const attachments = findAttachmentParts(attrs.struct);
                  imap.quantityNFEDownloaded += attachments.length;
                  attachments.forEach((attachment) => {
                    if (isXml(attachment)) {
                      const emailFetchByUID = imap.fetch(attrs.uid, {
                        bodies: [attachment.partID],
                        struct: true,
                      });
                      emailFetchByUID.on(
                        "message",
                        buildAttMessageFunction(
                          attachment,
                          imap._config.folderName
                        )
                      );
                    }
                  });
                });
              });

              emailsFetch.on("error", function (err) {
                imap.end();
                reject(err);
              });

              emailsFetch.on("end", function () {
                imap.end();
              });
            }
          );
        });
      });

      imap.on("end", function () {
        resolve();
      });

      imap.on("close", function () {
        resolve();
      });

      imap.on("error", function (err) {
        reject(err);
      });

      imap.on("destroy", function (err) {
        reject(err);
      });

      imap.on("timeout", function (err) {
        reject(err);
      });

      imap.connect();
    });
  }
}
