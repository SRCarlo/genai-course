import { describe, expect, it } from "vitest";
import { signPayload, verifySignature } from "../src/webhooks/signature.js";

describe("webhook signatures", () => {
  const secret = "local-test-secret";

  it("accepts a valid signature", () => {
    const body = '{"id":"evt_1","type":"payment.failed","data":{}}';
    expect(verifySignature(body, signPayload(body, secret), secret)).toBe(true);
  });

  it("rejects a changed payload", () => {
    const body = '{"id":"evt_1","type":"payment.failed","data":{}}';
    expect(verifySignature(`${body} `, signPayload(body, secret), secret)).toBe(false);
  });

  it("rejects missing or malformed signatures", () => {
    expect(verifySignature("{}", undefined, secret)).toBe(false);
    expect(verifySignature("{}", "not-a-signature", secret)).toBe(false);
  });
});
