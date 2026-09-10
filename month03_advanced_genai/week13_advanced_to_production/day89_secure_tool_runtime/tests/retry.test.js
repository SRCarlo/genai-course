import test from "node:test";
import assert from "node:assert/strict";

import { retryTool } from "../src/runtime/tool.retry.js";
import { withTimeout } from "../src/runtime/tool.timeout.js";

test("retry succeeds after temporary failures", async () => {
  let attempts = 0;

  const result =
    await retryTool(
      async () => {
        attempts++;

        if (attempts < 3) {
          throw new Error("temporary");
        }

        return "success";
      },
      {
        maxAttempts: 3,
        baseDelayMs: 1
      }
    );

  assert.equal(
    result,
    "success"
  );

  assert.equal(
    attempts,
    3
  );
});

test("retry stops after maximum attempts", async () => {
  let attempts = 0;

  await assert.rejects(
    () =>
      retryTool(
        async () => {
          attempts++;
          throw new Error("failure");
        },
        {
          maxAttempts: 3,
          baseDelayMs: 1
        }
      )
  );

  assert.equal(
    attempts,
    3
  );
});

test("timeout rejects slow tool", async () => {
  await assert.rejects(
    () =>
      withTimeout(
        new Promise(
          (resolve) =>
            setTimeout(
              resolve,
              100
            )
        ),
        10
      ),
    {
      message: "TOOL_TIMEOUT"
    }
  );
});