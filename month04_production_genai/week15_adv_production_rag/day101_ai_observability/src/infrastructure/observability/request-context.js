import crypto from "node:crypto";
export function createRequestContext() {
  return { requestId: crypto.randomUUID(), startedAt: Date.now() };
}
