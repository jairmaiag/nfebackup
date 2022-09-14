import httpHelper from "../../app/helpers/http/HttpHelpers.js"
import { MissingParamError } from '../../app/errors/index.js'

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
      return httpHelper.ok(nfeBackup);
    } catch (error) {
      console.log(error);
      return httpHelper.serverError(error);
    }
  }
}

export default UpdateSyncronizerNFEBackupController;
