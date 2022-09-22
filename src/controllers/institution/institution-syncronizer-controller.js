import { InstitutionSyncronizerUseCase } from "../../usecases/institution/index.js";

const InstitutionSyncronizerController = (prismaClient) => {
  return async (request, response, next) => {
    try {
      const institutionSyncronizerUseCase = new InstitutionSyncronizerUseCase(
        prismaClient
      );

      await institutionSyncronizerUseCase.handle();
      response.status(200).json({ status: "success" });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
};

export default InstitutionSyncronizerController;
