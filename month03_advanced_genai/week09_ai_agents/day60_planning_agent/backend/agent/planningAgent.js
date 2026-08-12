import { executeStep } from "../executor/planExecutor.js";

import { addObservation } from "../state/planningState.js";

import { createInitialPlan, createReplan } from "../planner/planner.js";

import { validatePlan } from "../planner/planValidator.js";

import { getAvailableTools } from "../tools/toolRegistry.js";

import { generateFinalAnswer } from "../services/groqService.js";

function getNextPendingStep(state) {
  return state.plan.find((step) => step.status === "pending");
}

function markCompleted(state, step) {
  if (!state.completedSteps.includes(step.id)) {
    state.completedSteps.push(step.id);
  }
}

function markFailed(state, step) {
  if (!state.failedSteps.includes(step.id)) {
    state.failedSteps.push(step.id);
  }
}

export async function runPlanningAgent(state) {
  state.status = "planning";

  const availableTools = getAvailableTools();

  /*
   * STEP 1
   * Create initial plan using Groq.
   */

  console.log("\n___________________ PLANNING _______________\n");

  const initialPlan = await createInitialPlan(state.goal, availableTools);

  validatePlan(initialPlan, {
    maxSteps: state.maxSteps,

    allowedTools: availableTools,
  });

  state.plan = initialPlan.steps;

  state.status = "running";

  console.log("[INITIAL PLAN]");

  console.log(JSON.stringify(state.plan, null, 2));

  /*
   * STEP 2
   * Execution loop.
   */

  while (state.status === "running") {
    if (state.stepCount >= state.maxSteps) {
      state.status = "failed";

      state.error = "Maximum agent steps exceeded";

      break;
    }

    const step = getNextPendingStep(state);

    /*
     * No pending steps means
     * the plan is complete.
     */

    if (!step) {
      state.status = "completed";

      break;
    }

    /*
     * Execute step.
     */

    const execution = await executeStep(step, state);

    /*
     * Save observation.
     */

    addObservation(state, {
      stepId: step.id,

      description: step.description,

      tool: step.tool,

      success: execution.success,

      result: execution.result ?? null,

      error: execution.error ?? null,
    });

    /*
     * Successful step.
     */

    if (execution.success) {
      markCompleted(state, step);

      continue;
    }

    /*
     * Failed step.
     */

    markFailed(state, step);

    /*
     * Retry.
     */

    if (step.retries < state.maxRetries) {
      step.retries += 1;

      step.status = "pending";

      console.log(`[RETRY] Step ${step.id}`);

      continue;
    }

    /*
     * Replanning.
     */

    console.log("\n________________ REPLANNING _________________\n");

    try {
      const newPlan = await createReplan({
        goal: state.goal,

        previousPlan: state.plan,

        observations: state.observations,

        failedStep: step,

        availableTools,
      });

      validatePlan(newPlan, {
        maxSteps: state.maxSteps,

        allowedTools: availableTools,
      });

      state.plan = newPlan.steps;

      state.stepCount = 0;

      console.log("[NEW PLAN]");

      console.log(JSON.stringify(state.plan, null, 2));
    } catch (error) {
      state.status = "failed";

      state.error = error.message;
    }
  }

  /*
   * Final answer.
   */

  if (state.status === "completed") {
    console.log("\n________________ FINAL ANSWER ___________________\n");

    state.result = await generateFinalAnswer({
      goal: state.goal,

      observations: state.observations,
    });
  }

  return state;
}
