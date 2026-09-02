import { describe, it, expect } from "vitest";

import { agentSuccess, agentFailure } from "../src/orchestration/result.js";

describe("Agent Result", () => {
  it("creates success result", () => {
    const result = agentSuccess(
      "researcher",

      {
        findings: [],
      },

      "coder",
    );

    expect(result.success).toBe(true);

    expect(result.agent).toBe("researcher");

    expect(result.nextAgent).toBe("coder");

    expect(result.error).toBeNull();
  });

  it("creates failure result", () => {
    const result = agentFailure(
      "researcher",

      "Research failed",
    );

    expect(result.success).toBe(false);

    expect(result.data).toBeNull();

    expect(result.error).toBe("Research failed");
  });
});
