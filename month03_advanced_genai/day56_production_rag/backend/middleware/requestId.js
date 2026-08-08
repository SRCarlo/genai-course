import crypto from "crypto";

export function requestId(req, res, next) {
  req.requestId = crypto.randomUUID();

  res.setHeader("X-Request-ID", req.requestId);

  next();
}
