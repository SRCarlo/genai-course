import test from "node:test";
import assert from "node:assert/strict";
import { validateContextSize } from "../src/ai/rag/context.guard.js";

test("should allow context below limit", () =>
  assert.equal(validateContextSize(5000, 6000), true));
test("should reject context above limit", () =>
  assert.throws(
    () => validateContextSize(7000, 6000),
    /Context exceeds 6000 tokens/,
  ));
test("should reject invalid token count", () =>
  assert.throws(
    () => validateContextSize("invalid", 6000),
    /Invalid context token count/,
  ));
