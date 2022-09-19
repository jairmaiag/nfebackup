import { AppError } from "../helpers/app-error.js";

const ErrorHandler = (error, request, response, next) => {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: "error",
      message: error.message,
    });
  }
  return response.status(500).json({
    status: "error",
    message: `Internal server error - ${error.message}`,
  });
};

export default ErrorHandler;
