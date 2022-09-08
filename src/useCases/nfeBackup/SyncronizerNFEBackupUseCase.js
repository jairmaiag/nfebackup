const FindAllSyncronizerNFEBackupController = require("../../controllers/nfeBackup/FindAllSyncronizerNFEBackupController");
const UpdateSyncronizerNFEBackupController = require("../../controllers/nfeBackup/UpdateSyncronizerNFEBackupController");
const IMAPUseCase = require("../imap/ReadEmailUseCase");

class SyncronizerNFEBackupUseCase {
  constructor(prismaClient) {
    this.prismaClient = prismaClient;
  }

  async handle() {
    const imapUseCase = new IMAPUseCase();
    const findAllSyncronizerNFEBackupController =
      new FindAllSyncronizerNFEBackupController(this.prismaClient);
    const updateSyncronizerNFEBackupController =
      new UpdateSyncronizerNFEBackupController(this.prismaClient);

    const nfeBackups = await findAllSyncronizerNFEBackupController.handle();
    if (nfeBackups.statusCode == 200) {
      for (let index = 0; index < nfeBackups.body.length; index++) {
        const RowNFEBackup = nfeBackups.body[index];

        const IMAPConfigs = {
          host: RowNFEBackup.nfeEmailHost,
          password: RowNFEBackup.nfeEmailPassword,
          port: RowNFEBackup.nfeEmailPort,
          user: RowNFEBackup.nfeEmailUser,
          searchDate: "2022-09-07T03:00:00.000+00:00",
          folderName: "emitidas",
        };

        console.log(`Consultando: ${RowNFEBackup.nfeEmailUser}`);

        try {
          await imapUseCase.handle(IMAPConfigs);
          const nfeBackup = await updateSyncronizerNFEBackupController.handle(
            RowNFEBackup.id,
            new Date()
          );
          console.log(`Email Consultado: ${RowNFEBackup.nfeEmailUser}`);

          if (nfeBackup.statusCode != 200) {
            console.log(nfeBackup);
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
  }
}

module.exports = SyncronizerNFEBackupUseCase;
