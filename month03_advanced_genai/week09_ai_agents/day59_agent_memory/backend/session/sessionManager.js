import crypto from "crypto";

/**
 * Create a secure random session ID.
 */
export function createSessionId() {
  return crypto.randomUUID();
}

/**
 * Validate session ID.
 */
export function isValidSessionId(sessionId) {
  return typeof sessionId === "string" && sessionId.trim().length > 0;
}
