import { createPlan } from "./planSchema.js";

import { createPlanWithGroq, replanWithGroq } from "../services/groqService.js";

export async function createInitialPlan(goal, availableTools) {
  const generated = await createPlanWithGroq({
    goal,
    availableTools,
  });

  return createPlan(generated.goal ?? goal, generated.steps ?? []);
}

export async function createReplan({
  goal,
  previousPlan,
  observations,
  failedStep,
  availableTools,
}) {
  const generated = await replanWithGroq({
    goal,
    previousPlan,
    observations,
    failedStep,
    availableTools,
  });

  return createPlan(generated.goal ?? goal, generated.steps ?? []);
}
