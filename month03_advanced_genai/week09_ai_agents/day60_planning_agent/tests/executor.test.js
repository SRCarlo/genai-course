import test from "node:test";

import assert from "node:assert/strict";

import { createPlanningState } from "../backend/state/planningState.js";

import { executeStep } from "../backend/executor/planExecutor.js";

test("calculator executes sum", async () => {
  const state = createPlanningState("Calculate sum");

  state.plan = [
    {
      id: 1,

      description: "Calculate sum",

      tool: "calculator",

      input: {
        operation: "sum",

        values: [10, 20, 30, 40],
      },

      status: "pending",

      result: null,

      error: null,

      retries: 0,
    },
  ];

  const result = await executeStep(state.plan[0], state);

  assert.equal(result.success, true);

  assert.equal(result.result, 100);
});

test("calculator executes division from previous step", async () => {
  const state = createPlanningState("Calculate average");

  state.plan = [
    {
      id: 1,

      description: "Calculate sum",

      tool: "calculator",

      input: {
        operation: "sum",

        values: [10, 20, 30, 40],
      },

      status: "pending",

      result: null,

      error: null,

      retries: 0,
    },

    {
      id: 2,

      description: "Divide sum by count",

      tool: "calculator",

      input: {
        operation: "divide",

        fromStep: 1,

        b: 4,
      },

      status: "pending",

      result: null,

      error: null,

      retries: 0,
    },
  ];

  await executeStep(state.plan[0], state);

  const result = await executeStep(state.plan[1], state);

  assert.equal(result.success, true);

  assert.equal(result.result, 25);
});
