export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);

    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const unauthorized = (message = "Authentication required") =>
  new AppError(message, 401);

export const forbidden = (message = "Forbidden") => new AppError(message, 403);

export const badRequest = (message = "Bad request") =>
  new AppError(message, 400);

export const notFound = (message = "Resource not found") =>
  new AppError(message, 404);
