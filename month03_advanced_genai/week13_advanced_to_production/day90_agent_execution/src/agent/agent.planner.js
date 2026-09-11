import { generateAgentPlan } from "../ai/groq.client.js";

import { validatePlan } from "../planning/plan.schema.js";

import { createDeterministicPlan } from "../planning/planner.js";

export async function createAgentPlan(state) {
  try {
    const response = await generateAgentPlan({
      goal: state.goal,
      state,
    });

    const rawPlan = Array.isArray(response) ? response : response.plan;

    return validatePlan(rawPlan);
  } catch (error) {
    console.error("Groq planner failed:", error.message);

    console.log("Using deterministic safety fallback.");

    return createDeterministicPlan(state.goal);
  }
}
