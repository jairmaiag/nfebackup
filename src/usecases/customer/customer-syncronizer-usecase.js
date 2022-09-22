import { CustomerRepository } from "../../database/repository/index.js";
import { IMAPReadEmailUseCase as imapReadEmail } from "../imap/index.js";

class CustomerSyncronizerUseCase {
  constructor(prismaClient) {
    this.prismaClient = prismaClient;
  }

  async handle() {
    const imapUseCase = new imapReadEmail();
    const customerRepository = new CustomerRepository(this.prismaClient);

    const customers = await customerRepository.findMany();

    for (const customer of customers) {
      customer.mailboxes.user = customer.mailboxes.email;
      /* "2022-09-07T03:00:00.000+00:00" */
      customer.mailboxes.searchDate = institution.mailboxes.lastDateRead;
      customer.mailboxes.folderName = "recebidas";

      console.log(`Consultando : ${customer.mailboxes.email}`);

      const imapResult = await imapUseCase.handle(customer.mailboxes);
      if (imapResult) {
        const institutionUpdated = await customerRepository.updateSincronizer(
          customer.id
        );
      }

      console.log(`E-mail consultado : ${customer.mailboxes.email}`);
    }

    console.log(
      "retornar lista de emails consultados e atualizados ou não atualizados"
    );
  }
}

export default CustomerSyncronizerUseCase;
