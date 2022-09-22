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
        institution.mailboxes.user = institution.mailboxes.email;
        /* "2022-09-07T03:00:00.000+00:00" */
        institution.mailboxes.searchDate = institution.mailboxes.lastDateRead;
        institution.mailboxes.folderName = "emitidas";

        const imapResult = await imapUseCase.handle(institution.mailboxes);
        if (imapResult) {
          const institutionUpdated =
            await institutionRepository.updateSincronizer(institution.id);
        }
      }

      console.log(
        "retornar lista de emails consultados e atualizados ou não atualizados"
      );
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

export default InstitutionSyncronizerUseCase;
