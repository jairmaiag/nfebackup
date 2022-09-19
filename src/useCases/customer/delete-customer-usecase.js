import { AppError } from "../../app/helpers/app-error.js";
import { CustomerRepository } from "../../database/repository/index.js";

class DeleteCustomerUseCase {
  constructor(prismaClient) {
    this.prismaClient = prismaClient;
  }

  async handle(request) {
    try {
      const { cnpj } = request.params;
      const customerRepository = new CustomerRepository(this.prismaClient);
      const customer = await customerRepository.findUnique(cnpj);
      if (!customer) {
        throw new AppError("Customer not found", 404);
      }
      const deletedCustomer = await customerRepository.delete(cnpj);
      return deletedCustomer;
    } catch (error) {
      console.log(error);
      // next(error);
    }
  }
}

export default DeleteCustomerUseCase;
