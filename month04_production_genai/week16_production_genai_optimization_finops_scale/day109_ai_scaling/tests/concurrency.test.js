import test from "node:test";
import assert from "node:assert/strict";
import { ConcurrencyLimiter } from "../src/scaling/concurrency.js";

test("does not exceed concurrency limit", async () => {
  const limiter = new ConcurrencyLimiter(5);
  let active = 0;
  let maxActive = 0;

  const tasks = Array.from({ length: 50 }, async () =>
    limiter.run(async () => {
      active++;
      maxActive = Math.max(maxActive, active);

      await new Promise((resolve) =>
        setTimeout(resolve, 20)
      );

      active--;
    })
  );

  await Promise.all(tasks);

  assert.ok(maxActive <= 5);
  assert.equal(limiter.active, 0);
});
