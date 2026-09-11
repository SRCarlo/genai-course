import test from "node:test";
import assert from "node:assert/strict";

import { isRetryableError } from "../src/execution/retry.js";

test("timeout is retryable", () => {
  const error = new Error("timeout");

  error.code = "TIMEOUT";

  assert.equal(isRetryableError(error), true);
});

test("unauthorized is not retryable", () => {
  const error = new Error("unauthorized");

  error.code = "UNAUTHORIZED";

  assert.equal(isRetryableError(error), false);
});
