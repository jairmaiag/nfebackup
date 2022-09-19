import { ValidateCNPJEmailPasswordCustomerUseCase } from "../../usecases/customer/index.js";

const ValidateCNPJEmailPasswordCustomerController = (prismaClient) => {
  return async (request, response, next) => {
    try {
      const validateCNPJEmailPasswordCustomerUseCase =
        new ValidateCNPJEmailPasswordCustomerUseCase(prismaClient);
      const customer = await validateCNPJEmailPasswordCustomerUseCase.handle(
        request.body
      );
      if (customer) {
        response.status(200).json({ status: "success", data: customer });
      }
    } catch (error) {
      next(error);
    }
  };
};

export default ValidateCNPJEmailPasswordCustomerController;
