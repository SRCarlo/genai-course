import test from "node:test";
import assert from "node:assert/strict";
import { CircuitBreaker } from "../src/resilience/circuit-breaker.js";
test("circuit opens after threshold failures", async () => {
  const b = new CircuitBreaker({ failureThreshold: 3, resetTimeout: 100 });
  const f = async () => {
    throw new Error("Provider failed");
  };
  for (let i = 0; i < 3; i++) await assert.rejects(() => b.execute(f));
  assert.equal(b.getState(), "OPEN");
});
