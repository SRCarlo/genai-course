import test from "node:test";
import assert from "node:assert/strict";
import { detectPII, redactPII } from "../../src/security/index.js";

test("detects email", () => {
  const result = detectPII("Contact john@example.com");
  assert.equal(result.email, true);
});

test("detects phone", () => {
  const result = detectPII("Call +91 987-654-3210");
  assert.equal(result.phone, true);
});

test("redacts email and phone", () => {
  const result = redactPII("Contact john@example.com or +91 987-654-3210");

  assert.equal(result.includes("john@example.com"), false);
  assert.equal(result.includes("[REDACTED_EMAIL]"), true);
  assert.equal(result.includes("[REDACTED_PHONE]"), true);
});
