export const successResponse = (
  res,
  data,
  statusCode = 200,
  message = "Success",
  success = true,
) => {
  res.status(statusCode).json({
    success,
    message,
    data,
  });
};

export const errorResponse = (res, message, statusCode = 500) => {
  res.status(statusCode).json({
    success: false,
    message,
  });
};
