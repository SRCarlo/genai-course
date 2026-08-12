import { createPlanningState } from "../state/planningState.js";

import { runPlanningAgent } from "../agent/planningAgent.js";

export async function runAgent(req, res) {
  try {
    const { sessionId, goal, maxSteps, maxRetries, maxToolCalls } = req.body;

    if (typeof goal !== "string" || goal.trim() === "") {
      return res.status(400).json({
        error: "goal is required",
      });
    }

    const state = createPlanningState(goal, {
      sessionId,

      maxSteps: maxSteps ?? 10,

      maxRetries: maxRetries ?? 2,

      maxToolCalls: maxToolCalls ?? 20,
    });

    const result = await runPlanningAgent(state);

    return res.json({
      sessionId: result.sessionId,

      goal: result.goal,

      status: result.status,

      result: result.result,

      plan: result.plan,

      currentStep: result.currentStep,

      completedSteps: result.completedSteps,

      failedSteps: result.failedSteps,

      observations: result.observations,

      stepCount: result.stepCount,

      totalToolCalls: result.totalToolCalls,

      error: result.error ?? null,
    });
  } catch (error) {
    console.error("[AGENT ERROR]", error);

    return res.status(500).json({
      error: error.message,
    });
  }
}
