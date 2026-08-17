import crypto from "crypto";

export function createRequestId() {
  return `req_${crypto.randomUUID()}`;
}