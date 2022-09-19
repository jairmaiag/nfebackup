import { CustomerRepository } from "../../database/repository/index.js";
import { IMAPReadEmailUseCase as imapReadEmail } from "../imap/index.js";

class CustomerSyncronizerUseCase {
  constructor(prismaClient) {
    this.prismaClient = prismaClient;
  }

  async handle() {
    try {
      const imapUseCase = new imapReadEmail();
      const customerRepository = new CustomerRepository(this.prismaClient);

      const customers = await customerRepository.findMany();

      for (const customer of customers) {
        customer.mailboxes[0].user = customer.mailboxes[0].email;
        /* "2022-09-07T03:00:00.000+00:00" */
        customer.mailboxes[0].searchDate = new Date();
        customer.mailboxes[0].folderName = "emitidas";

        console.log(`Consultando : ${customer.mailboxes[0].email}`);

        const imapResult = await imapUseCase.handle(customer.mailboxes[0]);

        const institutionUpdated = await customerRepository.updateSincronizer(
          customer.id
        );

        console.log(`E-mail consultado : ${customer.mailboxes[0].email}`);

        console.log(imap);
      }

      console.log(
        "retornar lista de emails consultados e atualizados ou não atualizados"
      );
    } catch (error) {
      console.log(error);
      // next(error);
    }
  }
}

export default CustomerSyncronizerUseCase;
