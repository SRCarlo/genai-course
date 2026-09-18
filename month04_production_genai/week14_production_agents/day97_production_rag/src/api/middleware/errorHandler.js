export class AppError extends Error {
  constructor(message, code, statusCode = 500) {
    super(message);

    this.code = code;

    this.statusCode = statusCode;
  }
}

export function errorHandler(error, req, res, next) {
  console.error(error);

  const statusCode = error.statusCode || 500;

  const code = error.code || "INTERNAL_SERVER_ERROR";

  res.status(statusCode).json({
    error: {
      code,
      message: error.message || "Something went wrong",
    },
  });
}
