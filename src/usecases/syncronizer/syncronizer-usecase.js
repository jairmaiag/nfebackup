import { AppError } from "../../app/helpers/app-error.js";
import { IMAPUseCase as IMAP } from "../imap/index.js";
import { Email } from "../../app/utils/email.js";

class SyncronizerUseCase {
  constructor(repository, folderName) {
    this.repository = repository;
    this.folderName = folderName;
  }

  async handle() {
    let entities;
    let imapUseCase;
    try {
      imapUseCase = new IMAP();
      const inactive = false;
      entities = await this.repository.findMany(inactive);

      for (const institution of entities) {
        try {
          institution.mailboxes.user = institution.mailboxes.email;
          /* "2022-09-07T03:00:00.000+00:00" */
          institution.mailboxes.searchDate = institution.mailboxes.lastDateRead;
          institution.mailboxes.folderName = this.folderName;
          institution.errorOnRead = false;
          institution.errorOnUpdate = false;
          await imapUseCase.handle(institution.mailboxes);
        } catch (error) {
          institution.errorOnRead = true;
          continue;
        }

        try {
          await this.repository.updateSincronizer(institution.id);
        } catch (error) {
          institution.errorOnUpdate = true;
          continue;
        }
      }

      await this.sendEmailWithErrors(entities);
    } catch (error) {
      throw error;
    }
  }

  async sendEmailWithErrors(entities) {
    try {
      const entitiesWithError = entities.filter(
        (entity) => entity.errorOnRead || entity.errorOnUpdate
      );

      if (entitiesWithError.length > 0) {
        let textEmail =
          "id|email|errorOnRead|errorOnUpdate|lastDateRead|folderName";
        for (const institution of entitiesWithError) {
          textEmail +=
            `\n${institution.id}|${institution.mailboxes.email}|${institution.errorOnRead}|${institution.errorOnUpdate}|` +
            `${new Date(institution.mailboxes.lastDateRead).toISOString()}|${
              institution.mailboxes.folderName
            }`;
        }
        const email = new Email();
        await email.sendEmail(
          process.env.COMPANY_EMAIL_USER,
          "Erro ao sincronizar e-mails",
          "Erro na sincronização/update dos e-mails:\n" + textEmail
        );

        throw new AppError("Erro na sincronização dos e-mails", 401);
      }
    } catch (error) {
      throw error;
    }
  }
}

export default SyncronizerUseCase;
