import test from "node:test";
import assert from "node:assert/strict";
import { ConcurrencyLimiter } from "../../src/performance/concurrency.js";

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

test("concurrency limiter never exceeds its limit", async () => {
  const limiter = new ConcurrencyLimiter(2);
  let active = 0;
  let maxActive = 0;

  await Promise.all(Array.from({ length: 6 }, () => limiter.run(async () => {
    active++;
    maxActive = Math.max(maxActive, active);
    await sleep(20);
    active--;
  })));

  assert.ok(maxActive <= 2, `max active was ${maxActive}`);
});
