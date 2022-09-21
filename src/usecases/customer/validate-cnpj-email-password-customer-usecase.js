import { AppError } from "../../app/helpers/app-error.js";
import { CustomerRepository } from "../../database/repository/index.js";

class ValidateCNPJEmailPasswordCustomerUseCase {
  constructor(prismaClient) {
    this.prismaClient = prismaClient;
  }

  async handle(requestBody) {
    const { CNPJ, email, password } = requestBody;

    const customerRepository = new CustomerRepository(this.prismaClient);

    const customer = await customerRepository.findUnique(CNPJ);

    if (!customer) {
      throw new AppError("Customer not found", 404);
    }
    if (
      customer.mailboxes.email !== email ||
      customer.mailboxes.password !== password
    ) {
      throw new AppError(
        `Invalid E-mail: '${email}' or passwoard for CNPJ: '${CNPJ}'`,
        400
      );
    }

    return customer;
  }
}

export default ValidateCNPJEmailPasswordCustomerUseCase;
