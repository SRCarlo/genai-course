export function errorHandler(error, req, res, next) {
  console.error("[ERROR]", error.message);

  let statusCode = 500;

  if (error.message.includes("Maximum")) {
    statusCode = 429;
  }

  res.status(statusCode).json({
    error: statusCode === 500 ? "Internal server error" : error.message,
  });
}
