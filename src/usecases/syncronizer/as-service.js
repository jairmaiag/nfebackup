const prismaClient = require("../../database/prisma-client.js");
const dotenv = require("dotenv");
dotenv.config();
import { InstitutionSyncronizerUseCase } from "../institution/index.js";
import { CustomerSyncronizerUseCase } from "../customer/index.js";

class AsService {
  async handle() {
    try {
      const institutionSyncronizerUseCase = new InstitutionSyncronizerUseCase(
        prismaClient
      );
      await institutionSyncronizerUseCase.handle();

      const customerSyncronizerUseCase = new CustomerSyncronizerUseCase(
        prismaClient
      );
      await customerSyncronizerUseCase.handle();
    } catch (error) {
      throw error;
    }
  }
}

export default AsService;