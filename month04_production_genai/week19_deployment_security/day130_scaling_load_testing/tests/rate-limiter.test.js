const test = require("node:test");
const assert = require("node:assert/strict");

const { createRateLimiter } = require("../src/scaling/rate-limiter");

test("allows requests up to the limit", () => {
  let now = 1_000;

  const allow = createRateLimiter({
    limit: 2,
    windowMs: 1_000,
    now: () => now,
  });

  assert.equal(allow("tenant-a"), true);
  assert.equal(allow("tenant-a"), true);
  assert.equal(allow("tenant-a"), false);

  now = 2_000;
  assert.equal(allow("tenant-a"), true);
});

test("tracks clients separately", () => {
  const allow = createRateLimiter({
    limit: 1,
    windowMs: 60_000,
    now: () => 1_000,
  });

  assert.equal(allow("tenant-a"), true);
  assert.equal(allow("tenant-a"), false);
  assert.equal(allow("tenant-b"), true);
});

test("rejects an invalid limit", () => {
  assert.throws(() => createRateLimiter({ limit: 0 }), /positive integer/);
});
