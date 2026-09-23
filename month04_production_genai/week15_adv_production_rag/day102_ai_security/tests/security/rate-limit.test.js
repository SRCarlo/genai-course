import test from "node:test";
import assert from "node:assert/strict";
import {
  checkRateLimit,
  resetRateLimits,
} from "../../src/security/rate-limiter.js";

test("11th request is rejected when limit is 10", () => {
  resetRateLimits();

  for (let i = 0; i < 10; i++) {
    assert.equal(checkRateLimit("test-user", 10, 60000), true);
  }

  assert.equal(checkRateLimit("test-user", 10, 60000), false);
});
