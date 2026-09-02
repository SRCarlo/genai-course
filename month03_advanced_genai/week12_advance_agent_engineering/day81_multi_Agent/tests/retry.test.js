import { describe, it, expect } from "vitest";

import { retry } from "../src/orchestration/retry.js";

describe("Retry", () => {
  it("retries failed operation", async () => {
    let attempts = 0;

    const result = await retry(
      async () => {
        attempts++;

        if (attempts < 3) {
          throw new Error("Temporary failure");
        }

        return "success";
      },
      {
        maxAttempts: 3,

        baseDelay: 1,
      },
    );

    expect(result).toBe("success");

    expect(attempts).toBe(3);
  });
});
