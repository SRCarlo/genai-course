import test from "node:test";
import assert from "node:assert/strict";
import { RequestDeduplicator } from "../src/cache/request-dedup.js";

test("100 identical concurrent requests execute once", async () => {
  const dedup = new RequestDeduplicator();
  let calls = 0;

  const task = async () => {
    calls++;
    await new Promise(resolve => setTimeout(resolve, 50));
    return "result";
  };

  const requests = Array.from(
    { length: 100 },
    () => dedup.execute("same-key", task)
  );

  const results = await Promise.all(requests);

  assert.equal(calls, 1);
  assert.equal(results.length, 100);
  assert.ok(results.every(result => result === "result"));
});

test("different keys execute independently", async () => {
  const dedup = new RequestDeduplicator();
  let calls = 0;

  const task = async () => {
    calls++;
    return "result";
  };

  await Promise.all([
    dedup.execute("key-a", task),
    dedup.execute("key-b", task),
    dedup.execute("key-c", task)
  ]);

  assert.equal(calls, 3);
});
