const { imap } = require("../../controllers/imap/IMAPController");

module.exports = class ReadEmailUseCase {
  async handle(objData) {
    imap._config = { ...imap._config, ...objData };

    return await new Promise((resolve, reject) => {
      imap.on("error", (err) => {
        console.log(
          "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
        );
        console.error(err);
        reject(err);
      });
      imap.on("ready", () => resolve());
      imap.connect();
    }).catch(console.log("Erro do IMAP"));
  }
};
