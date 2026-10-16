import { randomUUID } from "node:crypto";

const SAFE_REQUEST_ID = /^[A-Za-z0-9._-]{1,80}$/;

export function requestContext(req, res, next) {
  const incomingId = req.get("x-request-id");
  const requestId =
    incomingId && SAFE_REQUEST_ID.test(incomingId)
      ? incomingId
      : `req_${randomUUID()}`;

  req.requestId = requestId;
  res.setHeader("x-request-id", requestId);
  next();
}
