import test from "node:test";
import assert from "node:assert/strict";
import { retry } from "../src/resilience/retry.js";
test("retry succeeds after failures", async () => {
  let attempts = 0;
  const result = await retry(
    async () => {
      attempts++;
      if (attempts < 3) throw new Error("Temporary failure");
      return "success";
    },
    { retries: 3, baseDelay: 1 },
  );
  assert.equal(result, "success");
  assert.equal(attempts, 3);
});
