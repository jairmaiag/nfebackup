import { CustomerSyncronizerUseCase } from "../../usecases/customer/index.js";

const CustomerSyncronizerController = (prismaClient) => {
  return async (request, response, next) => {
    try {
      const customerSyncronizerUseCase = new CustomerSyncronizerUseCase(
        prismaClient
      );

      await customerSyncronizerUseCase.handle();
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
};

export default CustomerSyncronizerController;
