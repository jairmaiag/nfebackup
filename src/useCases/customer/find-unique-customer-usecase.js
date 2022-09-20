import { AppError } from "../../app/helpers/app-error.js";
import { CustomerRepository } from "../../database/repository/index.js";

class FindUniqueCustomerUseCase {
  constructor(prismaClient) {
    this.prismaClient = prismaClient;
  }

  async handle(request) {
    try {
      const { id, cnpj } = request.params;

      const customerRepository = new CustomerRepository(this.prismaClient);

      const customer = await customerRepository.findUnique(cnpj, id);

      if (!customer) {
        throw new AppError("Customer not found", 404);
      }

      return customer;
    } catch (error) {
      throw error;
    }
  }
}

export default FindUniqueCustomerUseCase;
