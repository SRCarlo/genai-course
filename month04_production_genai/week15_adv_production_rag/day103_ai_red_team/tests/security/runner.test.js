import { describe, expect, it } from "vitest";
import { runSecurityTests } from "../../src/security/security-test-runner.js";

describe("security test runner", () => {
  it("executes every test", async () => {
    const tests = [
      { id: "T1", category: "PROMPT_INJECTION", input: "hello", severity: "LOW" },
      { id: "T2", category: "JAILBREAK", input: "hello", severity: "LOW" }
    ];

    const results = await runSecurityTests(tests, async input => `response:${input}`);

    expect(results).toHaveLength(2);
    expect(results[0].status).toBe("EXECUTED");
  });
});
