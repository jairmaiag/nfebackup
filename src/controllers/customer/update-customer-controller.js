import { UpdateCustomerUseCase } from "../../usecases/customer/index.js";

const UpdateCustomerController = (prismaClient) => {
  return async (request, response, next) => {
    try {
      const updateCustomerUseCase = new UpdateCustomerUseCase(prismaClient);
      const updatedCustomer = await updateCustomerUseCase.handle(request.body);
      if (updatedCustomer) {
        response.status(200).json({ status: "success" });
      }
    } catch (error) {
      next(error);
    }
  };
};

export default UpdateCustomerController;
