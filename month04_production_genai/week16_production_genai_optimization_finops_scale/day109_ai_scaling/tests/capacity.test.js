import test from "node:test";
import assert from "node:assert/strict";

test("capacity calculation", () => {
  const targetRps = 100;
  const workerRps = 5;

  const workers = Math.ceil(targetRps / workerRps);

  assert.equal(workers, 20);
});

test("capacity with 25 percent headroom", () => {
  const requiredWorkers = 20;
  const workersWithHeadroom = Math.ceil(
    requiredWorkers * 1.25
  );

  assert.equal(workersWithHeadroom, 25);
});
