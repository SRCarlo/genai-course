import { jest } from "@jest/globals";

jest.unstable_mockModule("../src/services/llm.service.js", () => ({
  createAgentCompletion: jest.fn().mockResolvedValue({
    choices: [
      {
        message: {
          role: "assistant",
          content: "The calculation is 10000.",
          tool_calls: [],
        },
      },
    ],
  }),
}));

const { runAgent } = await import("../src/agent/agent.js");

describe("Agent", () => {
  test("returns final answer", async () => {
    const result = await runAgent("Calculate 20% of 50000");

    expect(result.answer).toBe("The calculation is 10000.");

    expect(result.status).toBe("completed");
  });
});
