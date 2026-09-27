import test from "node:test";
import assert from "node:assert/strict";
import { shouldCompress } from "../../src/cost/conversation-compressor.js";
import {
  canRetry,
  isRetryableError
} from "../../src/cost/retry-budget.js";

test("conversation compression starts at threshold", () => {
  assert.equal(
    shouldCompress({
      tokenCount: 6000,
      threshold: 6000
    }),
    true
  );
});

test("retry budget blocks retries after maximum", () => {
  assert.equal(canRetry(0, 2), true);
  assert.equal(canRetry(1, 2), true);
  assert.equal(canRetry(2, 2), false);
});

test("temporary provider failure is retryable", () => {
  assert.equal(
    isRetryableError({ status: 503 }),
    true
  );
});

test("authorization failure is not retryable", () => {
  assert.equal(
    isRetryableError({ status: 401 }),
    false
  );
});