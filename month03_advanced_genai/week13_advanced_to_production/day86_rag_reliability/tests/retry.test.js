import test from "node:test";
import assert from "node:assert/strict";

import { retry, isRetryableError } from "../src/reliability/retry.js";

test("identifies 429 as retryable", () => {
  assert.equal(
    isRetryableError({
      status: 429,
    }),
    true,
  );
});

test("identifies 503 as retryable", () => {
  assert.equal(
    isRetryableError({
      status: 503,
    }),
    true,
  );
});

test("identifies 400 as non-retryable", () => {
  assert.equal(
    isRetryableError({
      status: 400,
    }),
    false,
  );
});

test("retries a failed operation", async () => {
  let attempts = 0;

  const result = await retry(async () => {
    attempts++;

    if (attempts < 2) {
      const error = new Error("Temporary failure");

      error.status = 503;

      throw error;
    }

    return "success";
  }, 2);

  assert.equal(result, "success");
  assert.equal(attempts, 2);
});

test("throws after retry attempts are exhausted", async () => {
  let attempts = 0;

  await assert.rejects(async () => {
    await retry(async () => {
      attempts++;

      const error = new Error("Service unavailable");

      error.status = 503;

      throw error;
    }, 2);
  }, /Service unavailable/);

  assert.equal(attempts, 2);
});
