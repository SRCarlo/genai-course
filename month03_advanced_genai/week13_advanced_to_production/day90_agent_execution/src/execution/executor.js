import { getReadySteps } from "../planning/dependency.graph.js";

import { executeStep } from "../agent/agent.executor.js";

export async function executePlan({ state, tracer }) {
  state.status = "executing";

  while (true) {
    const readySteps = getReadySteps(state.plan);

    if (readySteps.length === 0) {
      break;
    }

    const step = readySteps[0];

    state.currentStep = state.plan.findIndex(
      (candidate) => candidate.id === step.id,
    );

    step.status = "running";

    const result = await executeStep({
      state,
      step,
      tracer,
    });

    if (result.status === "waiting_for_approval") {
      return state;
    }
  }

  return state;
}
