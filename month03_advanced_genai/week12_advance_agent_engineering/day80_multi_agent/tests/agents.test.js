import { SharedState } from "../src/state/shared.state.js";

import { ResearcherAgent } from "../src/agents/researcher.agent.js";

describe("Researcher Agent", () => {
  test("has correct identity", () => {
    const agent = new ResearcherAgent();

    expect(agent.name).toBe("researcher");

    expect(agent.role).toBe("Research and information gathering");
  });
});

describe("Shared State", () => {
  test("stores and retrieves values", () => {
    const state = new SharedState();

    state.set("research", {
      test: true,
    });

    expect(state.get("research")).toEqual({
      test: true,
    });
  });
});
