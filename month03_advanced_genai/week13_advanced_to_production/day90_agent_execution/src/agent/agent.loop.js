import { createAgentPlan } from "./agent.planner.js";

import { executePlan } from "../execution/executor.js";

import { shouldTerminate } from "./agent.termination.js";

import { createTracer } from "../observability/tracer.js";

export async function runAgent(state) {
  const tracer = createTracer(state);

  const startedAt = Date.now();

  while (!shouldTerminate(state)) {
    state.iteration++;

    tracer.start("agent.iteration", {
      iteration: state.iteration,
    });

    if (Date.now() - startedAt > state.budget.maxExecutionTimeMs) {
      state.status = "terminated";

      state.errors.push({
        code: "EXECUTION_TIME_BUDGET_EXCEEDED",

        message: "Agent execution time exceeded.",
      });

      break;
    }

    state.status = "planning";

    const plan = await createAgentPlan(state);

    state.plan = plan;

    const execution = await executePlan({
      state,
      tracer,
    });

    if (execution.status === "waiting_for_approval") {
      return state;
    }

    const hasFailedStep = state.plan.some((step) => step.status === "failed");

    if (hasFailedStep) {
      state.status = "recovering";

      continue;
    }

    const hasPendingSteps = state.plan.some(
      (step) => step.status === "pending",
    );

    if (!hasPendingSteps) {
      state.status = "completed";

      state.result = {
        success: true,

        message: "Customer support task completed.",

        observations: state.observations,
      };

      break;
    }
  }

  if (
    state.iteration >= state.budget.maxIterations &&
    state.status !== "completed"
  ) {
    state.status = "terminated";
  }

  return state;
}
