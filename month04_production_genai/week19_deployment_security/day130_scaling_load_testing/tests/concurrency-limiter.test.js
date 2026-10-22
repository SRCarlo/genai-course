const test = require("node:test");
const assert = require("node:assert/strict");

const {
  createConcurrencyLimiter,
} = require("../src/scaling/concurrency-limiter");

test("rejects work when capacity is full", async () => {
  const run = createConcurrencyLimiter(1);

  let release;

  const first = run(
    () =>
      new Promise((resolve) => {
        release = resolve;
      }),
  );

  await new Promise((resolve) => setImmediate(resolve));

  await assert.rejects(
    run(async () => "second"),
    (error) => error.code === "OVER_CAPACITY",
  );

  release("first-result");

  assert.equal(await first, "first-result");
  assert.equal(await run(async () => "next-result"), "next-result");
});
