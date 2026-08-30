import express from "express";

import { executeAgent } from "../agent/agent.js";

const router = express.Router();

router.post("/run", async (req, res) => {
  try {
    const { message } = req.body;

    if (typeof message !== "string" || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: "message is required",
      });
    }

    const state = await executeAgent(message);

    const response = {
      success: state.status === "completed",

      status: state.status,

      answer: state.finalAnswer,

      toolsUsed: state.toolCalls.map((call) => call.tool),

      iterations: state.iteration,

      requestId: state.requestId,

      durationMs: state.durationMs,
    };

    if (state.status === "waiting_for_user") {
      response.question = state.clarificationQuestion;
    }

    if (state.status === "waiting_for_approval") {
      response.approvalRequired = true;

      response.approvalRequest = state.approvalRequest;
    }

    return res.json(response);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      error: "Agent execution failed",
    });
  }
});

export default router;
