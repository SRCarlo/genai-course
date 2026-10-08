import crypto from "node:crypto";

export function createWebhookSignature(rawBody, secret) {
  return crypto
    .createHmac("sha256", secret)
    .update(rawBody, "utf8")
    .digest("hex");
}

export function verifyWebhookSignature(rawBody, signature, secret) {
  if (!signature || !secret) return false;

  const expected = createWebhookSignature(rawBody, secret);

  const providedBuffer = Buffer.from(signature, "utf8");
  const expectedBuffer = Buffer.from(expected, "utf8");

  if (providedBuffer.length !== expectedBuffer.length) return false;

  return crypto.timingSafeEqual(providedBuffer, expectedBuffer);
}
