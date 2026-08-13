import { runReactAgent } from "../react/reactAgent.js";

import { decideNextAction } from "../services/decisionService.js";

export async function runReact(req, res) {
  try {
    const { goal } = req.body;

    if (!goal || typeof goal !== "string" || !goal.trim()) {
      return res.status(400).json({
        error: "goal is required and must be a non-empty string",
      });
    }

    const result = await runReactAgent(goal.trim(), decideNextAction);

    return res.json({
      status: result.status,

      answer: result.finalAnswer,

      iterations: result.iteration,

      toolCalls: result.toolCalls,

      errors: result.errors,

      trace: result.trace,
    });
  } catch (error) {
    console.error("ReAct controller error:", error);

    return res.status(500).json({
      error: error.message,
    });
  }
}
