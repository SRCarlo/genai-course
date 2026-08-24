import test from "node:test";

import assert from "node:assert/strict";

import { redactObject, safeTextMetadata } from "../src/utils/redaction.js";

test("redacts API keys", () => {
  const input = {
    apiKey: "secret-key",

    username: "demo",
  };

  const output = redactObject(input);

  assert.equal(output.apiKey, "[REDACTED]");

  assert.equal(output.username, "demo");
});

test("redacts authorization headers", () => {
  const input = {
    authorization: "Bearer secret",
  };

  const output = redactObject(input);

  assert.equal(output.authorization, "[REDACTED]");
});

test("does not expose text contents", () => {
  const result = safeTextMetadata("secret user prompt");

  assert.equal(result.length, 18);

  assert.equal(result.text, undefined);
});
