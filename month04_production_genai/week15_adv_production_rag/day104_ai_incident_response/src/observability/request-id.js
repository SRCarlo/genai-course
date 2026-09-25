import crypto from "node:crypto";

export function createRequestId() {
  return crypto.randomUUID();
}
