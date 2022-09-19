import { InstitutionRepository } from "../../database/repository/index.js";
import { IMAPReadEmailUseCase as imapReadEmail } from "../imap/index.js";

class InstitutionSyncronizerUseCase {
  constructor(prismaClient) {
    this.prismaClient = prismaClient;
  }

  async handle() {
    try {
      const imapUseCase = new imapReadEmail();
      const institutionRepository = new InstitutionRepository(
        this.prismaClient
      );

      const institutions = await institutionRepository.findMany();

      for (const institution of institutions) {
        institution.mailboxes[0].user = institution.mailboxes[0].email;
        /* "2022-09-07T03:00:00.000+00:00" */
        institution.mailboxes[0].searchDate = new Date();
        institution.mailboxes[0].folderName = "emitidas";

        console.log(`Consultando : ${institution.mailboxes[0].email}`);

        const imapResult = await imapUseCase.handle(institution.mailboxes[0]);

        const institutionUpdated =
          await institutionRepository.updateSincronizer(institution.id);

        console.log(`E-mail consultado : ${institution.mailboxes[0].email}`);

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

export default InstitutionSyncronizerUseCase;
