import test from "node:test";
import assert from "node:assert/strict";

import { createAgentState } from "../src/agent/agent.state.js";

test("creates initial agent state", () => {
  const state = createAgentState("Refund order 12345");

  assert.equal(state.status, "pending");

  assert.equal(state.iteration, 0);

  assert.deepEqual(state.observations, []);

  assert.deepEqual(state.toolCalls, []);
});
