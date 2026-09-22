import { createRequestContext } from "../../infrastructure/observability/request-context.js";
import {
  increment,
  recordLatency,
} from "../../infrastructure/observability/metrics.js";
import { startTimer } from "../../infrastructure/observability/timer.js";
import { logger } from "../../infrastructure/observability/logger.js";

export function observabilityMiddleware(req, res, next) {
  const context = createRequestContext();
  const timer = startTimer();
  req.requestId = context.requestId;
  req.requestStartedAt = context.startedAt;
  res.setHeader("X-Request-ID", req.requestId);
  increment("requests");
  logger.info({
    event: "request_started",
    requestId: req.requestId,
    method: req.method,
    path: req.path,
  });
  res.on("finish", () => {
    const latencyMs = timer.elapsed();
    recordLatency("request", latencyMs);
    logger.info({
      event: "request_completed",
      requestId: req.requestId,
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      latencyMs,
    });
  });
  next();
}
