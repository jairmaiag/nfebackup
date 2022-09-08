const SyncronizerNFEBackupUseCase = require("./SyncronizerNFEBackupUseCase");

module.exports = function NFEBackupSyncronizer(prismaClient) {
  return async (request, response) => {
    try {
      const syncronizerNFEBackupUseCase = new SyncronizerNFEBackupUseCase(
        prismaClient
      );
      await syncronizerNFEBackupUseCase.handle();
    } catch (error) {
      console.log(error);
      // response.status(500).json({ error: `${error}` });
    }
  };
};