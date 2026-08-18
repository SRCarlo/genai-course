import { describe, expect, test } from "vitest";

import { validateOutput } from "../security/outputValidator.js";

import { redactSecrets, redactPII } from "../security/piiRedactor.js";

describe("Output Security", () => {
  test("accepts normal output", () => {
    const result = validateOutput(
      "Customers can request refunds within 30 days.",
    );

    expect(result.valid).toBe(true);
  });

  test("rejects output containing API key", () => {
    const result = validateOutput("api_key=sk-super-secret-value");

    expect(result.valid).toBe(false);
  });

  test("rejects output containing password", () => {
    const result = validateOutput("password=supersecret123");

    expect(result.valid).toBe(false);
  });

  test("redacts API keys", () => {
    const result = redactSecrets("api_key=sk-123456");

    expect(result).toBe("api_key=[REDACTED]");
  });

  test("redacts passwords", () => {
    const result = redactSecrets("password=my-password");

    expect(result).toBe("password=[REDACTED]");
  });

  test("redacts email addresses", () => {
    const result = redactPII("Contact attacker@example.com");

    expect(result).toContain("[EMAIL_REDACTED]");
  });

  test("rejects excessively long output", () => {
    const output = "A".repeat(10001);

    const result = validateOutput(output);

    expect(result.valid).toBe(false);
  });
});
