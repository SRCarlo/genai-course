import { describe, it, expect } from "vitest";

import { SharedState } from "../src/state/shared.state.js";

describe("SharedState", () => {
  it("stores and retrieves values", () => {
    const state = new SharedState();

    state.set("task", "Build API");

    expect(state.get("task")).toBe("Build API");
  });

  it("increments values", () => {
    const state = new SharedState();

    state.set("step", 0);

    state.increment("step");

    expect(state.get("step")).toBe(1);
  });

  it("stores history", () => {
    const state = new SharedState();

    state.addHistory({
      agent: "coder",

      status: "success",
    });

    expect(state.get("history")).toHaveLength(1);
  });

  it("tracks token usage", () => {
    const state = new SharedState();

    state.addUsage({
      prompt_tokens: 100,

      completion_tokens: 50,

      total_tokens: 150,
    });

    expect(state.get("usage").totalTokens).toBe(150);
  });
});
