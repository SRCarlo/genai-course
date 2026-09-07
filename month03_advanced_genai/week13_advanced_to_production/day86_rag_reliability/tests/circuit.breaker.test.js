import test from "node:test";
import assert from "node:assert/strict";

import { CircuitBreaker } from "../src/reliability/circuit.breaker.js";

test("starts in CLOSED state", () => {
  const breaker = new CircuitBreaker({
    failureThreshold: 2,
    resetTimeout: 100,
  });

  assert.equal(breaker.getState().state, "CLOSED");
});

test("opens after failure threshold", async () => {
  const breaker = new CircuitBreaker({
    failureThreshold: 2,
    resetTimeout: 100,
  });

  await assert.rejects(() =>
    breaker.execute(async () => {
      throw new Error("failure");
    }),
  );

  await assert.rejects(() =>
    breaker.execute(async () => {
      throw new Error("failure");
    }),
  );

  assert.equal(breaker.getState().state, "OPEN");
});

test("rejects requests while circuit is open", async () => {
  const breaker = new CircuitBreaker({
    failureThreshold: 1,
    resetTimeout: 1000,
  });

  await assert.rejects(() =>
    breaker.execute(async () => {
      throw new Error("failure");
    }),
  );

  await assert.rejects(
    () => breaker.execute(async () => "should not execute"),
    (error) => {
      assert.equal(error.code, "CIRCUIT_OPEN");

      assert.equal(error.statusCode, 503);

      return true;
    },
  );
});

test("closes after successful recovery", async () => {
  const breaker = new CircuitBreaker({
    failureThreshold: 1,
    resetTimeout: 10,
  });

  await assert.rejects(() =>
    breaker.execute(async () => {
      throw new Error("failure");
    }),
  );

  await new Promise((resolve) => setTimeout(resolve, 20));

  const result = await breaker.execute(async () => "recovered");

  assert.equal(result, "recovered");

  assert.equal(breaker.getState().state, "CLOSED");
});
