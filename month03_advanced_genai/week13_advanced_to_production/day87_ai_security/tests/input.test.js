import test from "node:test";
import assert from "node:assert/strict";
import { validateQuestion } from "../src/security/input.validator.js";

test("accepts valid input", () => {
  const result = validateQuestion({ question: "Explain secure RAG." });
  assert.equal(result.question, "Explain secure RAG.");
  assert.equal(result.role, "user");
});

test("rejects too-short input", () => {
  assert.throws(() => validateQuestion({ question: "Hi" }));
});

test("rejects oversized input", () => {
  assert.throws(() => validateQuestion({ question: "x".repeat(2001) }));
});
