import test from "node:test";
import assert from "node:assert/strict";

import { calculateBackoff, withRetry } from "../src/workflow/workflow.retry.js";

test("backoff grows exponentially", () => {
  const a = calculateBackoff(0, 1000);
  const b = calculateBackoff(1, 1000);
  const c = calculateBackoff(2, 1000);

  assert.ok(a >= 1000 && a < 1250);
  assert.ok(b >= 2000 && b < 2250);
  assert.ok(c >= 4000 && c < 4250);
});

test("retry succeeds after transient failures", async () => {
  let attempts = 0;

  const result = await withRetry(
    async () => {
      attempts += 1;
      if (attempts < 3) {
        const error = new Error("temporary");
        error.code = "TIMEOUT";
        throw error;
      }
      return "success";
    },
    { maxRetries: 3 }
  );

  assert.equal(result, "success");
  assert.equal(attempts, 3);
});
