import { AppError } from "../../app/helpers/app-error.js";
import { IMAPUseCase as IMAP } from "../imap/index.js";
import { Email } from "../../app/utils/email.js";

class SyncronizerUseCase {
  constructor(repository, folderName, emailFlag) {
    this.repository = repository;
    this.folderName = folderName;
    this.emailFlag = emailFlag;
  }

  async handle() {
    let entities;
    let imapUseCase;
    try {
      imapUseCase = new IMAP();
      const inactive = false;
      entities = await this.repository.findMany(inactive);

      for (const entity of entities) {
        try {
          console.log("Lendo email: ", entity.mailboxes.email);
          entity.mailboxes.user = entity.mailboxes.email;
          /* "2022-09-07T03:00:00.000+00:00" */
          entity.mailboxes.searchDate = entity.mailboxes.lastDateRead;
          entity.mailboxes.folderName = this.folderName;
          entity.errorOnRead = false;
          entity.errorOnUpdate = false;
          entity.mailboxes.emailFlag = this.emailFlag;
          entity.mailboxes.errorOnFlagSet = false;
          entity.mailboxes.quantityNFEDownloaded = 0;
          entity.mailboxes.quantityEmailRead = 0;
          await imapUseCase.handle(entity.mailboxes);
          if (entity.mailboxes.quantityNFEDownloaded == 0) {
            continue;
          }
        } catch (error) {
          console.log("Erro lendo email: ", entity.mailboxes.email);
          entity.errorOnRead = true;
          continue;
        }

        try {
          await this.repository.updateSincronizer(entity.id);
        } catch (error) {
          console.log("Erro atualizando email: ", entity.mailboxes.email);
          entity.errorOnUpdate = true;
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
        (entity) =>
          entity.errorOnRead ||
          entity.errorOnUpdate ||
          entity.mailboxes.errorOnFlagSet
      );

      if (entitiesWithError.length > 0) {
        let textEmail =
          "id|email|errorOnRead|errorOnUpdate|Seen/Deleted|folderName|lastDateRead";
        for (const institution of entitiesWithError) {
          textEmail +=
            `\n${institution.id}|${institution.mailboxes.email}|${institution.errorOnRead}|${institution.errorOnUpdate}|${institution.mailboxes.errorOnFlagSet}|` +
            `${institution.mailboxes.folderName}|${new Date(
              institution.mailboxes.lastDateRead
            ).toISOString()}`;
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
