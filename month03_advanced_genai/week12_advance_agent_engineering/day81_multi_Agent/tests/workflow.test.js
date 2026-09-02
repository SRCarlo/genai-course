import { describe, it, expect } from "vitest";

import { Workflow } from "../src/orchestration/workflow.js";

import { SharedState } from "../src/state/shared.state.js";

class FakeExecutor {
  constructor() {
    this.reviewCount = 0;
  }

  async execute(agent, input, state) {
    if (agent === "researcher") {
      const data = {
        findings: ["Redis supports TTL"],
      };

      state.set("research", data);

      return {
        success: true,

        agent: "researcher",

        data,

        nextAgent: "coder",

        error: null,
      };
    }

    if (agent === "coder") {
      const data = {
        implementation: "Redis caching layer",
      };

      state.set("code", data);

      return {
        success: true,

        agent: "coder",

        data,

        nextAgent: "reviewer",

        error: null,
      };
    }

    if (agent === "reviewer") {
      this.reviewCount++;

      const approved = this.reviewCount >= 2;

      const data = {
        approved,

        issues: approved ? [] : ["Improve error handling"],

        suggestions: [],
      };

      state.set("review", data);

      return {
        success: true,

        agent: "reviewer",

        data,

        nextAgent: approved ? null : "coder",

        error: null,
      };
    }

    if (agent === "fallback-researcher") {
      const data = {
        fallback: true,

        findings: ["Fallback research"],
      };

      state.set("research", data);

      return {
        success: true,

        agent: "fallback-researcher",

        data,

        nextAgent: "coder",

        error: null,
      };
    }

    throw new Error(`Unknown agent: ${agent}`);
  }
}

describe("Workflow", () => {
  it("runs research -> coder -> reviewer -> coder -> reviewer", async () => {
    const state = new SharedState({
      maxSteps: 10,

      maxReviewAttempts: 3,
    });

    const executor = new FakeExecutor();

    const workflow = new Workflow(executor, state);

    const result = await workflow.run("Build Redis caching");

    expect(result.status).toBe("completed");

    expect(result.review.approved).toBe(true);

    expect(result.reviewAttempts).toBe(2);

    expect(result.research).toBeDefined();

    expect(result.code).toBeDefined();
  });
});
