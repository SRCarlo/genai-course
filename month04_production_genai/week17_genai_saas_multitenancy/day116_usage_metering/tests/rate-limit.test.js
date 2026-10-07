import test from "node:test";
import assert from "node:assert/strict";
import { FixedWindowRateLimiter } from "../src/rate-limit/fixed-window.js";
import { SlidingWindowRateLimiter } from "../src/rate-limit/sliding-window.js";

test("fixed window allows until limit", () => {
  const limiter = new FixedWindowRateLimiter({
    limit: 2,
    windowMs: 60_000
  });

  assert.equal(limiter.allow("tenant-a").allowed, true);
  assert.equal(limiter.allow("tenant-a").allowed, true);
  assert.equal(limiter.allow("tenant-a").allowed, false);
});

test("sliding window rejects after limit", () => {
  const limiter = new SlidingWindowRateLimiter({
    limit: 2,
    windowMs: 60_000
  });

  assert.equal(limiter.allow("tenant-a").allowed, true);
  assert.equal(limiter.allow("tenant-a").allowed, true);
  assert.equal(limiter.allow("tenant-a").allowed, false);
});
