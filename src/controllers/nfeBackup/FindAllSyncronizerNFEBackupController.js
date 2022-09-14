import httpHelper from '../../app/helpers/http/HttpHelpers.js'

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
      return nfeBackups ? httpHelper.ok(nfeBackups) : httpHelper.notFound("Registro não encontrado");
    } catch (error) {
      console.log(error);
      return httpHelper.serverError(error);
    }
  }
}

export default FindAllSyncronizerNFEBackupController;
