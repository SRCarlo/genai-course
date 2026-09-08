import test from "node:test";
import assert from "node:assert/strict";
import { validateOutput } from "../src/security/output.validator.js";

test("accepts secure output shape", () => {
  const result = validateOutput({
    answer: "Least privilege limits permissions.",
    sources: [{ documentId: "security-policy-001", title: "Security Policy" }]
  });

  assert.equal(result.sources.length, 1);
});

test("rejects malformed model output", () => {
  assert.throws(() => validateOutput({ answer: 42, sources: [] }));
});
