import express from "express";
import crypto from "crypto";

import { generateAIResponse } from "../services/ai.service.js";

const router = express.Router();

router.post("/chat", async (req, res, next) => {
  try {
    const requestId = `req_${crypto.randomUUID()}`;

    const userId = req.header("x-user-id") || "user_demo";

    const tenantId = req.header("x-tenant-id") || "tenant_demo";

    const { message } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        success: false,
        message: "message is required",
      });
    }

    const result = await generateAIResponse({
      requestId,
      userId,
      tenantId,
      endpoint: "/api/ai/chat",
      message,
    });

    res.json({
      success: true,

      requestId,

      response: result.response,

      usage: result.usage,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
