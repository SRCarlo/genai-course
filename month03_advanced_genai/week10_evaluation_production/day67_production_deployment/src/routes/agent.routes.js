import express from "express";

import { generateResponse } from "../services/groq.service.js";

const router = express.Router();

router.post("/api/chat", async (req, res, next) => {
  try {
    const { message } = req.body;

    /*
     * Input validation
     */
    if (typeof message !== "string" || message.trim().length === 0) {
      return res.status(400).json({
        success: false,

        error: "message must be a non-empty string",

        requestId: req.requestId,
      });
    }

    /*
     * Maximum input length
     */
    if (message.length > 5000) {
      return res.status(400).json({
        success: false,

        error: "message must not exceed 5000 characters",

        requestId: req.requestId,
      });
    }

    const startTime = Date.now();

    /*
     * Call Groq
     */
    const result = await generateResponse(message.trim());

    const latencyMs = Date.now() - startTime;

    /*
     * Structured LLM log
     */
    console.log(
      JSON.stringify({
        level: "info",

        event: "llm.request.completed",

        requestId: req.requestId,

        model: result.model,

        latencyMs,

        usage: result.usage,

        timestamp: new Date().toISOString(),
      }),
    );

    res.status(200).json({
      success: true,

      requestId: req.requestId,

      response: result.content,

      model: result.model,

      usage: result.usage,

      latencyMs,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
