import { CreateCustomerUseCase } from "../../usecases/customer/index.js";

const CreateCustomerController = (prismaClient) => {
  return async (request, response, next) => {
    try {
      const createCustomerUseCase = new CreateCustomerUseCase(prismaClient);
      const newCustomer = await createCustomerUseCase.handle(request.body);
      if (newCustomer) {
        response.status(200).json({ status: "success" });
      }
    } catch (error) {
      next(error);
    }
  };
};

export default CreateCustomerController;
