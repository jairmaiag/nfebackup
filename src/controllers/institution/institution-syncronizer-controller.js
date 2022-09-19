import { InstitutionSyncronizerUseCase } from "../../usecases/institution/index.js";

const InstitutionSyncronizerController = (prismaClient) => {
  return async (request, response, next) => {
    try {
      const institutionSyncronizerUseCase = new InstitutionSyncronizerUseCase(
        prismaClient
      );

      await institutionSyncronizerUseCase.handle();
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
};

export default InstitutionSyncronizerController;
