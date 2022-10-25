import { AppError } from "../../app/helpers/app-error.js";
import { CustomerRepository } from "../../database/repository/index.js";

class UpdateCustomerUseCase {
  constructor(prismaClient) {
    this.prismaClient = prismaClient;
  }

  async handle(requestBody) {
    const data = requestBody;
    delete data.id;
    const mailboxes = requestBody.mailboxes;
    const addresses = requestBody.addresses;
    const institutions = requestBody.institutions;

    const customerRepository = new CustomerRepository(this.prismaClient);

    const customer = await customerRepository.findUnique(data.CNPJ);

    if (!customer) {
      throw new AppError("Customer not found", 404);
    }

    const updatedCustomer = await customerRepository.update(
      data,
      mailboxes,
      addresses,
      institutions
    );

    return updatedCustomer;
  }
}

export default UpdateCustomerUseCase;
