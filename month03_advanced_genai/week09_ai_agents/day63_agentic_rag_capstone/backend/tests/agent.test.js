import { jest } from "@jest/globals";

jest.unstable_mockModule("../agent/planner.js", () => ({
  getAgentDecision: jest.fn(),
}));

const { getAgentDecision } = await import("../agent/planner.js");

const { runReactLoop } = await import("../agent/reactLoop.js");

import { createAgentState } from "../agent/state.js";

describe("Agent State", () => {
  test("creates initial agent state", () => {
    const state = createAgentState({
      question: "What is our refund policy?",

      sessionId: "test-session",
    });

    expect(state.question).toBe("What is our refund policy?");

    expect(state.sessionId).toBe("test-session");

    expect(state.history).toEqual([
      {
        role: "user",
        content: "What is our refund policy?",
      },
    ]);

    expect(state.iteration).toBe(0);

    expect(state.toolCalls).toBe(0);

    expect(state.ragCalls).toBe(0);

    expect(state.finalAnswer).toBeNull();

    expect(state.status).toBe("running");
  });

  test("has maximum iteration limit", () => {
    const state = createAgentState({
      question: "test",

      sessionId: "test",
    });

    expect(state.maxIterations).toBeGreaterThan(0);
  });

  test("has maximum tool call limit", () => {
    const state = createAgentState({
      question: "test",

      sessionId: "test",
    });

    expect(state.maxToolCalls).toBeGreaterThan(0);
  });

  test("has maximum RAG call limit", () => {
    const state = createAgentState({
      question: "test",

      sessionId: "test",
    });

    expect(state.maxRagCalls).toBeGreaterThan(0);
  });
});
