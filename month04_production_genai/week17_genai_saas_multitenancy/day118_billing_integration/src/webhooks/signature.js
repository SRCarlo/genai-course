import { createHmac, timingSafeEqual } from "node:crypto";

export function signPayload(rawBody, secret) {
  if (typeof rawBody !== "string" || typeof secret !== "string" || !secret) {
    throw new TypeError("RAW_BODY_AND_SECRET_REQUIRED");
  }

  return createHmac("sha256", secret).update(rawBody, "utf8").digest("hex");
}

export function verifySignature(rawBody, signature, secret) {
  if (
    typeof rawBody !== "string" ||
    typeof signature !== "string" ||
    typeof secret !== "string" ||
    !secret ||
    !/^[a-f0-9]{64}$/i.test(signature)
  ) {
    return false;
  }

  const expected = Buffer.from(signPayload(rawBody, secret), "hex");
  const received = Buffer.from(signature, "hex");

  return expected.length === received.length && timingSafeEqual(expected, received);
}
