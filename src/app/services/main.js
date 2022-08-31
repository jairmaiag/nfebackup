const { imap } = require("../config/imap");

module.exports = async function (date) {
  imap.dados = date;
  imap.on("error", (err) => console.error(err));
  imap.on("end", () => console.log("Connection ended"));
  imap.connect();
  return imap;
};
