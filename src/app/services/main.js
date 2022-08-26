const { imap } = require("../config/imap");

module.exports = function (date) {
  imap.dados = date;
  imap.on("error", (err) => console.error(err));
  imap.on("end", () => console.log("Connection ended"));
  imap.connect();
  
  return imap;
};
