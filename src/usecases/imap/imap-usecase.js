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

  async handle(entityMailbox) {
    await new Promise((resolve, reject) => {
      const imap = new Imap(this._config);
      imap._config = { ...imap._config, ...entityMailbox };

      imap.once("ready", () => {
        imap.openBox("INBOX", false, (err, box) => {
          if (err) {
            throw err;
          }
          const defaultDate = process.env.DEFAULT_DATE;
          const searchDate = formatMesDiaAno(
            new Date(entityMailbox.searchDate || defaultDate)
          );
          imap.search(
            [["OR", "UNSEEN", ["SINCE", searchDate]]],
            function (err, results) {
              if (err) {
                throw err;
              }

              if (results.length === 0) {
                imap.end();
                return false;
              }

              entityMailbox.quantityEmailRead += results.length;
              const emailsFetch = imap.fetch(results, {
                bodies: ["HEADER.FIELDS (FROM TO SUBJECT DATE)"],
                struct: true,
              });

              emailsFetch.on("message", function (emailMessage, seqno) {
                emailMessage.on("attributes", function (attrs) {
                  /* The imap.addFlags() method is not working to all emails providers.
                  So, we control if the email was flagged by the imap server or not.
                  If the email are already flagged, we ingnore it and return. */

                  /* Check if attrs.flags contains entityMailbox.emailFlag
                  if yes, then return and do not process this email further */
                  const emailFlag = entityMailbox.emailFlag.startsWith("\\")
                    ? entityMailbox.emailFlag
                    : `\\${entityMailbox.emailFlag}`;
                  if (attrs.flags.includes(emailFlag)) {
                    return false;
                  }
                  const attachments = findAttachmentParts(attrs.struct);
                  if (attachments.length === 0) {
                    return false;
                  }
                  entityMailbox.quantityNFEDownloaded += attachments.length;

                  attachments
                    .filter((attac) => isXml(attac))
                    .forEach((attachment) => {
                      const emailFetchByUID = imap.fetch(attrs.uid, {
                        bodies: [attachment.partID],
                        struct: true,
                      });
                      emailFetchByUID.on(
                        "message",
                        buildAttMessageFunction(
                          attachment,
                          entityMailbox.folderName
                        )
                      );
                    });

                  // Work to gmail. But does not work to another email providers
                  imap.addFlags(
                    attrs.uid,
                    entityMailbox.emailFlag,
                    function (err) {
                      if (err) {
                        console.log(
                          `Error on addFlags: ${entityMailbox.emailFlag}`,
                          err
                        );
                      }
                    }
                  );
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
