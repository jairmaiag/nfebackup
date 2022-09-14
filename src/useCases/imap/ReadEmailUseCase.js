import { IMAPController as imap } from '../../controllers/imap/index.js'

export default class ReadEmailUseCase {
  async handle(objData) {
    imap._config = { ...imap._config, ...objData };

    return await new Promise((resolve, reject) => {
      imap.on("error", (err) => {
        console.error(err);
        reject(err);
      });
      imap.on("close", () => resolve());
      imap.connect();
    }).catch((err) => console.log("Erro do IMAP", err));
  }
};
