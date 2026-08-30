import test from "node:test";
import assert from "node:assert/strict";

import { shouldTerminate, LIMITS } from "../src/agent/termination.js";

function createState() {
  return {
    status: "running",
    iteration: 0,
    toolCalls: [],
    llmCalls: 0,
    costUsd: 0,
    startedAt: Date.now(),
  };
}

test("agent stops at maximum iterations", () => {
  const state = createState();

  state.iteration = LIMITS.maxIterations;

  const result = shouldTerminate(state);

  assert.equal(result, true);

  assert.equal(state.status, "max_iterations");
});

test("agent stops at maximum tool calls", () => {
  const state = createState();

  state.toolCalls = Array.from(
    {
      length: LIMITS.maxToolCalls,
    },
    () => ({
      tool: "brokenTool",
    }),
  );

  const result = shouldTerminate(state);

  assert.equal(result, true);

  assert.equal(state.status, "max_tool_calls");
});

test("agent stops at LLM call limit", () => {
  const state = createState();

  state.llmCalls = LIMITS.maxLLMCalls;

  const result = shouldTerminate(state);

  assert.equal(result, true);

  assert.equal(state.status, "llm_limit");
});

test("agent stops at cost limit", () => {
  const state = createState();

  state.costUsd = LIMITS.maxCostUsd;

  const result = shouldTerminate(state);

  assert.equal(result, true);

  assert.equal(state.status, "cost_limit");
});
