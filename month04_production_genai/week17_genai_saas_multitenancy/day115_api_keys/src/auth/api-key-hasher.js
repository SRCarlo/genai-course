import crypto from "node:crypto";

export function hashApiKey(apiKey) {
  return crypto.createHash("sha256").update(apiKey, "utf8").digest("hex");
}
