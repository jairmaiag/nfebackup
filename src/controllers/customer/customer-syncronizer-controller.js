import { CustomerSyncronizerUseCase } from "../../usecases/customer/index.js";

const CustomerSyncronizerController = (prismaClient) => {
  return async (request, response, next) => {
    try {
      const customerSyncronizerUseCase = new CustomerSyncronizerUseCase(
        prismaClient
      );

      await customerSyncronizerUseCase.handle();
      response.status(200).json({ status: "success" });
    } catch (error) {
      next(error);
    }
  };
};

export default CustomerSyncronizerController;
