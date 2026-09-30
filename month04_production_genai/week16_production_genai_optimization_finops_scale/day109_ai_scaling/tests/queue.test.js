import test from "node:test";
import assert from "node:assert/strict";
import { JobQueue } from "../src/queue/job-queue.js";

test("queue accepts jobs until max size", () => {
  const queue = new JobQueue(2);

  queue.push({ id: 1 });
  queue.push({ id: 2 });

  assert.equal(queue.size, 2);
});

test("queue applies backpressure when full", () => {
  const queue = new JobQueue(1);

  queue.push({ id: 1 });

  assert.throws(
    () => queue.push({ id: 2 }),
    (error) => error.code === "QUEUE_FULL"
  );
});
