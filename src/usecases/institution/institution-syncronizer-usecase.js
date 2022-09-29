import nodemailer from "nodemailer";
import { AppError } from "../../app/helpers/app-error.js";
import { InstitutionRepository } from "../../database/repository/index.js";
import { IMAPUseCase as IMAP } from "../imap/index.js";
import { Email } from "../../app/utils/email.js";

class InstitutionSyncronizerUseCase {
  constructor(prismaClient) {
    this.prismaClient = prismaClient;
  }

  async handle() {
    let institutions;
    let imapUseCase;
    let institutionRepository;
    try {
      imapUseCase = new IMAP();
      institutionRepository = new InstitutionRepository(this.prismaClient);
      const inactive = false;
      institutions = await institutionRepository.findMany(inactive);

      for (const institution of institutions) {
        try {
          institution.mailboxes.user = institution.mailboxes.email;
          /* "2022-09-07T03:00:00.000+00:00" */
          institution.mailboxes.searchDate = institution.mailboxes.lastDateRead;
          institution.mailboxes.folderName = "emitidas";
          institution.errorOnRead = false;
          institution.errorOnUpdate = false;
          await imapUseCase.handle(institution.mailboxes);
        } catch (error) {
          institution.errorOnRead = true;
          continue;
        }

        try {
          await institutionRepository.updateSincronizer(institution.id);
        } catch (error) {
          institution.errorOnUpdate = true;
          continue;
        }
      }

      await this.sendEmailWithErrors(institutions);
    } catch (error) {
      throw error;
    }
  }

  async sendEmailWithErrors(institutions) {
    try {
      const institutionsWithError = institutions.filter(
        (institution) => institution.errorOnRead || institution.errorOnUpdate
      );

      if (institutionsWithError.length > 0) {
        let textEmail =
          "id|email|errorOnRead|errorOnUpdate|lastDateRead|folderName";
        for (const institution of institutionsWithError) {
          textEmail +=
            `\n${institution.id}|${institution.mailboxes.email}|${institution.errorOnRead}|${institution.errorOnUpdate}|` +
            `${new Date(institution.mailboxes.lastDateRead).toISOString()}|${
              institution.mailboxes.folderName
            }`;
        }
        const email = new Email();
        await email.sendEmail(
          process.env.COMPANY_EMAIL_USER,
          "Erro ao sincronizar instituições",
          "Erro na sincronização/update das instituições:\n" + textEmail
        );

        throw new AppError("Erro na sincronização das instituições", 401);
      }
    } catch (error) {
      throw error;
    }
  }
}

export default InstitutionSyncronizerUseCase;
