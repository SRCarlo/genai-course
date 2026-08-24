import { logger } from "./logger.js";

export function errorHandler(err, req, res, next) {
  logger.error("Unhandled application error", {
    requestId: req.requestId,

    correlationId: req.correlationId,

    method: req.method,

    path: req.path,

    message: err.message,

    stack: err.stack,
  });

  if (res.headersSent) {
    return next(err);
  }

  res.status(500).json({
    error: "internal_server_error",

    requestId: req.requestId,
  });
}
