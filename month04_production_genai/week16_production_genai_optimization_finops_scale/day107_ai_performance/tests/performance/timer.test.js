import test from "node:test";
import assert from "node:assert/strict";
import { startTimer, elapsedMs } from "../../src/performance/timer.js";

test("timer measures approximately 50ms", async () => {
  const start = startTimer();
  await new Promise(resolve => setTimeout(resolve, 50));
  const elapsed = elapsedMs(start);
  assert.ok(elapsed >= 40, `Expected >= 40ms, got ${elapsed}`);
});
