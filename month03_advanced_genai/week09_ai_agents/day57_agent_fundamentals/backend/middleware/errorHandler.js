export function errorHandler(error, req, res, next) {
  console.error("Application error:");
  console.error(error);

  const statusCode = error.statusCode || 500;

  return res.status(statusCode).json({
    success: false,
    message: statusCode === 500 ? "Internal server error." : error.message,
  });
}
