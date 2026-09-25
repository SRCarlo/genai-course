import test from "node:test";
import assert from "node:assert/strict";
import { CircuitBreaker } from "../../src/resilience/circuit-breaker.js";

test("circuit opens after threshold failures", () => {
  let now = 1000;

  const breaker = new CircuitBreaker({
    failureThreshold: 3,
    resetTimeout: 1000,
    now: () => now,
  });

  breaker.recordFailure();
  breaker.recordFailure();
  assert.equal(breaker.state, "CLOSED");

  breaker.recordFailure();
  assert.equal(breaker.state, "OPEN");
  assert.equal(breaker.canRequest(), false);

  now += 1000;
  assert.equal(breaker.canRequest(), true);
  assert.equal(breaker.state, "HALF_OPEN");

  breaker.recordSuccess();

  assert.equal(breaker.state, "CLOSED");
  assert.equal(breaker.failures, 0);
});
