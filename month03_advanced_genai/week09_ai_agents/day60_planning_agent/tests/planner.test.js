import test from "node:test";

import assert from "node:assert/strict";

import { createPlan } from "../backend/planner/planSchema.js";

import { validatePlan } from "../backend/planner/planValidator.js";

test("createPlan creates valid structure", () => {
  const plan = createPlan("Test goal", [
    {
      description: "Test step",
      tool: null,
    },
  ]);

  assert.equal(plan.goal, "Test goal");

  assert.equal(plan.steps.length, 1);

  assert.equal(plan.steps[0].status, "pending");
});

test("validator accepts valid plan", () => {
  const plan = createPlan("Calculate", [
    {
      description: "Calculate sum",
      tool: "calculator",
    },
  ]);

  assert.equal(
    validatePlan(plan, {
      maxSteps: 10,

      allowedTools: ["calculator", "search"],
    }),
    true,
  );
});

test("validator rejects unauthorized tool", () => {
  const plan = createPlan("Test", [
    {
      description: "Dangerous operation",
      tool: "deleteEverything",
    },
  ]);

  assert.throws(
    () =>
      validatePlan(plan, {
        maxSteps: 10,

        allowedTools: ["calculator"],
      }),
    /Unauthorized tool/,
  );
});

test("validator rejects too many steps", () => {
  const plan = createPlan(
    "Test",
    Array.from(
      {
        length: 11,
      },
      (_, index) => ({
        description: `Step ${index + 1}`,
      }),
    ),
  );

  assert.throws(
    () =>
      validatePlan(plan, {
        maxSteps: 10,
      }),
    /maximum allowed steps/,
  );
});
