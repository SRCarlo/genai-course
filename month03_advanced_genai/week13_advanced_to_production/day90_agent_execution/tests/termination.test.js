import test from "node:test";
import assert from "node:assert/strict";

import { shouldTerminate } from "../src/agent/agent.termination.js";

test("terminates after max iterations", () => {
  const state = {
    status: "running",

    iteration: 10,

    budget: {
      maxIterations: 10,
      maxToolCalls: 20,
    },

    toolCalls: [],
  };

  assert.equal(shouldTerminate(state), true);
});

test("does not terminate normal state", () => {
  const state = {
    status: "executing",

    iteration: 2,

    budget: {
      maxIterations: 10,
      maxToolCalls: 20,
    },

    toolCalls: [],
  };

  assert.equal(shouldTerminate(state), false);
});
