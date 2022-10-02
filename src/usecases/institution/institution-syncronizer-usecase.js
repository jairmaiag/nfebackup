import { InstitutionRepository } from "../../database/repository/index.js";
import { SyncronizerUseCase } from "../syncronizer/index.js";

class InstitutionSyncronizerUseCase {
  constructor(prismaClient) {
    this.prismaClient = prismaClient;
  }

  async handle() {
    try {
      const institutionRepository = new InstitutionRepository(
        this.prismaClient
      );
      const syncronizerUseCase = new SyncronizerUseCase(
        institutionRepository,
        "emitidas",
        "Deleted"
      );
      await syncronizerUseCase.handle();
    } catch (error) {
      throw error;
    }
  }
}

export default InstitutionSyncronizerUseCase;
