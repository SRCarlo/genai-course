import { randomUUID } from "node:crypto";
export function getRequestId(req) {
  return req.headers["x-request-id"] || randomUUID();
}
