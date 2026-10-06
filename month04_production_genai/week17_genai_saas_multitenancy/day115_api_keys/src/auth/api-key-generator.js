import crypto from "node:crypto";

export function generateApiKey() {
  return `sk_live_${crypto.randomBytes(32).toString("hex")}`;
}

export function getApiKeyPrefix(apiKey) {
  return apiKey.slice(0, 16);
}
