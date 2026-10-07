import crypto from "node:crypto";

export function usageContext() {
  return (req, res, next) => {
    req.requestId = `req_${crypto.randomUUID()}`;
    res.setHeader("X-Request-Id", req.requestId);
    next();
  };
}
