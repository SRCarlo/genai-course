import test from "node:test";
import assert from "node:assert/strict";
import {
  authorizationFallback,
  llmFallback,
  retrievalFallback,
} from "../../src/resilience/fallback.js";

test("LLM fallback is explicit and safe", () => {
  const result = llmFallback(new Error("provider timeout"));

  assert.equal(result.fallback, true);
  assert.match(result.answer, /temporarily unavailable/);
});

test("RAG fallback does not fabricate sources", () => {
  const result = retrievalFallback();

  assert.equal(result.fallback, true);
  assert.deepEqual(result.sources, []);
  assert.match(result.answer, /knowledge service is temporarily unavailable/);
});

test("authorization fallback fails closed", () => {
  const result = authorizationFallback();

  assert.equal(result.allowed, false);
  assert.equal(result.fallback, true);
});
