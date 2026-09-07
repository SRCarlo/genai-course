import test from "node:test";
import assert from "node:assert/strict";

import { withTimeout } from "../src/reliability/timeout.js";

test("completes operation before timeout", async () => {
  const result = await withTimeout(async () => {
    return "completed";
  }, 1000);

  assert.equal(result, "completed");
});

test("aborts long-running operation", async () => {
  await assert.rejects(
    async () => {
      await withTimeout(async (signal) => {
        return new Promise((resolve, reject) => {
          const timer = setTimeout(() => resolve("done"), 1000);

          signal.addEventListener("abort", () => {
            clearTimeout(timer);

            const error = new Error("The operation was aborted");

            error.name = "AbortError";

            reject(error);
          });
        });
      }, 20);
    },
    {
      name: "AbortError",
    },
  );
});
