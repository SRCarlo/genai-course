import crypto from "node:crypto";

export function requestId(req, res, next) {
  const incomingRequestId = req.headers["x-request-id"];

  const incomingCorrelationId = req.headers["x-correlation-id"];

  const id =
    typeof incomingRequestId === "string" && incomingRequestId.length > 0
      ? incomingRequestId
      : `req_${crypto.randomUUID()}`;

  const correlationId =
    typeof incomingCorrelationId === "string" &&
    incomingCorrelationId.length > 0
      ? incomingCorrelationId
      : `corr_${crypto.randomUUID()}`;

  req.requestId = id;
  req.correlationId = correlationId;

  res.setHeader("X-Request-ID", id);

  res.setHeader("X-Correlation-ID", correlationId);

  next();
}
