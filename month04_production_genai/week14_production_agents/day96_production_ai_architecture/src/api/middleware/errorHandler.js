import { logger } from "../../infrastructure/observability/logger.js";

export function errorHandler(error, req, res, next) {
  logger.error("Request failed", {
    message: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method,
    userId: req.user?.id,
  });

  const statusCode = error.statusCode || 500;

  res.status(statusCode).json({
    error: {
      code: error.code || "INTERNAL_ERROR",

      message: statusCode === 500 ? "Internal server error" : error.message,
    },
  });
}
