import { createRequestId } from "../observability/request.context.js";
import { logger } from "../observability/logger.js";

export function requestMiddleware(
  req,
  res,
  next
) {
  const requestId =
    createRequestId();

  req.requestId = requestId;

  const start =
    performance.now();

  res.on("finish", () => {
    const latencyMs =
      Math.round(
        performance.now() -
          start
      );

    logger.info(
      "http_request_completed",
      {
        requestId,
        method: req.method,
        path: req.path,
        statusCode:
          res.statusCode,
        latencyMs
      }
    );
  });

  next();
}