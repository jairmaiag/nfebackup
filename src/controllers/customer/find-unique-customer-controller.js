import { FindUniqueCustomerUseCase } from "../../usecases/customer/index.js";

const FindUniqueCustomerController = (prismaClient) => {
  return async (request, response, next) => {
    try {
      const findUniqueCustomerUseCase = new FindUniqueCustomerUseCase(
        prismaClient
      );
      const customer = await findUniqueCustomerUseCase.handle(request);
      if (customer) {
        response.status(200).json({ status: "success" });
      }
    } catch (error) {
      next(error);
    }
  };
};

export default FindUniqueCustomerController;
