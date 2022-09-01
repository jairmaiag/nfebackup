const { imap } = require("../config/imap");

module.exports = async function (objData) {
  imap._config = { ...imap._config, ...objData }
  imap.on("error", (err) => console.error(err));
  imap.on("end", () => console.log("Connection ended"));
  imap.connect();
  return imap;
};
