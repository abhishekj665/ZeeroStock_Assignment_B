import { errorResponse } from "../utils/resonse.util.js";

export const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  errorResponse(res, err.message, err.statusCode);
};
