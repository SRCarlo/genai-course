import test from "node:test";
import assert from "node:assert/strict";
import { withTimeout } from "../../src/performance/timeout.js";

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

test("fast operation completes before timeout", async () => {
  const value = await withTimeout(Promise.resolve("ok"), 100);
  assert.equal(value, "ok");
});

test("slow operation times out", async () => {
  await assert.rejects(
    withTimeout(sleep(100), 10),
    /Operation timed out/
  );
});
