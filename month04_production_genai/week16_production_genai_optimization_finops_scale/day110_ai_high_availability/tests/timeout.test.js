import test from "node:test";
import assert from "node:assert/strict";
import { timeout } from "../src/resilience/timeout.js";
test("timeout rejects slow operation", async () => {
  const slow = () => new Promise((r) => setTimeout(() => r("done"), 1000));
  await assert.rejects(() => timeout(slow, 100), /timed out/);
});
