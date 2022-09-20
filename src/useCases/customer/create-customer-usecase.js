import { AppError } from "../../app/helpers/app-error.js";
import { CustomerRepository } from "../../database/repository/index.js";

class CreateCustomerUseCase {
  constructor(prismaClient) {
    this.prismaClient = prismaClient;
  }

  async handle(requestBody) {
    try {
      const data = requestBody;
      delete data.id;
      const mailboxes = requestBody.mailboxes;
      const addresses = requestBody.addresses;

      const customerRepository = new CustomerRepository(this.prismaClient);

      const customer = await customerRepository.findUnique(data.CNPJ);

      if (customer) {
        throw new AppError("Customer already exist", 401);
      }

      const newCustomer = await customerRepository.create(
        data,
        mailboxes,
        addresses
      );

      return newCustomer;
    } catch (error) {
      throw error;
    }
  }
}

export default CreateCustomerUseCase;
