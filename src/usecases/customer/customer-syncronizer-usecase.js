import { CustomerRepository } from "../../database/repository/index.js";
import { SyncronizerUseCase } from "../syncronizer/index.js";

class CustomerSyncronizerUseCase {
  constructor(prismaClient) {
    this.prismaClient = prismaClient;
  }

  async handle() {
    try {
      const customerRepository = new CustomerRepository(this.prismaClient);
      const syncronizerUseCase = new SyncronizerUseCase(
        customerRepository,
        "recebidas",
        "Deleted"
      );
      await syncronizerUseCase.handle();
    } catch (error) {
      throw error;
    }
  }
}

export default CustomerSyncronizerUseCase;
