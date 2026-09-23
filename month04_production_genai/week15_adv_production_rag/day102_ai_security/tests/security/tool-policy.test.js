import test from "node:test";
import assert from "node:assert/strict";
import {
  isToolAllowed,
  validateToolArguments,
} from "../../src/security/index.js";

test("safe search tool is allowed", () => {
  assert.equal(isToolAllowed("searchDocuments"), true);
});

test("dangerous delete tool is not allowed by default", () => {
  assert.equal(isToolAllowed("deleteDocument"), false);
});

test("valid tool arguments are accepted", () => {
  assert.deepEqual(
    validateToolArguments("searchDocuments", {
      query: "leave policy",
      limit: 5,
    }),
    { valid: true },
  );
});

test("unexpected arguments are rejected", () => {
  const result = validateToolArguments("searchDocuments", {
    query: "leave policy",
    secret: "do-not-accept",
  });

  assert.equal(result.valid, false);
  assert.equal(result.reason, "UNEXPECTED_ARGUMENTS");
});

test("missing required arguments are rejected", () => {
  const result = validateToolArguments("getUserProfile", {});

  assert.equal(result.valid, false);
});
