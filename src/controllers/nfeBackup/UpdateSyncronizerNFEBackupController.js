const { serverError, ok } = require("../../app/helpers/http/HttpHelpers");
const { MissingParamError } = require("../../app/errors/MissingParamError");

class UpdateSyncronizerNFEBackupController {
  constructor(prismaClient) {
    this.prismaClient = prismaClient;
  }

  async handle(id, nfeLastDateRead) {
    try {
      if (!id) {
        throw new MissingParamError("id");
      }
      if (!nfeLastDateRead) {
        throw new MissingParamError("nfeLastDateRead");
      }

      const nfeBackup = await this.prismaClient.NFEBackup.update({
        where: {
          id,
        },
        data: {
          nfeLastDateRead,
        },
        select: {
          id: true,
          nfeLastDateRead: true,
        },
      });
      return ok(nfeBackup);
    } catch (error) {
      console.log(error);
      return serverError(error);
    }
  }
}

module.exports = UpdateSyncronizerNFEBackupController;
