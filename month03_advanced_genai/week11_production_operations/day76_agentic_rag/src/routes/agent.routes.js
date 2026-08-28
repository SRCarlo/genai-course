import express from "express";
import { runAgent } from "../agent/agent.js";
import { validateInput } from "../guardrails/input.guard.js";
import { validateOutput } from "../guardrails/output.guard.js";

const router = express.Router();

router.post("/run", async (req, res) => {
  try {
    const validation = validateInput(req.body?.message);

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: validation.error,
      });
    }

    const result = await runAgent(validation.message);

    const outputValidation = validateOutput(result.answer);

    if (!outputValidation.valid) {
      return res.status(500).json({
        success: false,
        error: outputValidation.error,
      });
    }

    return res.json({
      success: result.success,

      answer: outputValidation.answer,

      toolsUsed: result.toolsUsed,

      toolCalls: result.toolCalls,

      iterations: result.iterations,

      status: result.status,

      metrics: result.metrics,
    });
  } catch (error) {
    console.error("Agent route error:", error);

    return res.status(500).json({
      success: false,
      error: "Internal server error.",
    });
  }
});

export default router;
