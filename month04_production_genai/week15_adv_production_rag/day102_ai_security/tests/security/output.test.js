import test from "node:test";
import assert from "node:assert/strict";
import {
  validateOutput,
  parseAndValidateModelOutput,
} from "../../src/security/output-validator.js";

test("valid output passes schema validation", () => {
  assert.equal(
    validateOutput({
      answer: "The policy is 18 days.",
      sources: ["doc-a-public"],
    }),
    true,
  );
});

test("malformed output is rejected", () => {
  assert.throws(
    () =>
      validateOutput({
        answer: 123,
        sources: [],
      }),
    /Invalid answer/,
  );
});

test("JSON output is parsed and validated", () => {
  const result = parseAndValidateModelOutput(
    JSON.stringify({
      answer: "Hello",
      sources: ["doc-1"],
    }),
  );

  assert.equal(result.answer, "Hello");
});
