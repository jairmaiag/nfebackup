const {
  serverError,
  ok,
  notFound,
} = require("../../app/helpers/http/HttpHelpers");

class FindAllSyncronizerNFEBackupController {
  constructor(prismaClient) {
    this.prismaClient = prismaClient;
  }

  async handle() {
    try {
      const nfeBackups = await this.prismaClient.NFEBackup.findMany({
        orderBy: {
          id: "asc",
        },
        select: {
          id: true,
          nfeEmailUser: true,
          nfeEmailPassword: true,
          nfeEmailHost: true,
          nfeEmailPort: true,
          nfeLastDateRead: true,
        },
      });
      return nfeBackups ? ok(nfeBackups) : notFound("Registro não encontrado");
    } catch (error) {
      console.log(error);
      return serverError(error);
    }
  }
}

module.exports = FindAllSyncronizerNFEBackupController;
