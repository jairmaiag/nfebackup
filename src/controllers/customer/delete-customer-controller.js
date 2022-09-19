import { DeleteCustomerUseCase } from "../../usecases/customer/index.js";

const DeleteCustomerController = (prismaClient) => {
  return async (request, response, next) => {
    try {
      const deleteCustomerUseCase = new DeleteCustomerUseCase(prismaClient);
      const deletedCustomer = deleteCustomerUseCase.handle(request);
      if (deletedCustomer) {
        response.status(200).json({ status: "success" });
      }
    } catch (error) {
      next(error);
    }
  };
};

export default DeleteCustomerController;
