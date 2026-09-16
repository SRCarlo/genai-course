import { Router } from "express";
import { runAgent } from "../agent/agent.js";
import { getMetrics } from "../observability/metrics.js";
import { listTools } from "../agent/executor.js";

export const router = Router();

router.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "production-ai-support-agent"
  });
});

router.get("/tools", (_req, res) => {
  res.json({ tools: listTools() });
});

router.get("/metrics", (_req, res) => {
  res.json(getMetrics());
});

router.post("/chat", async (req, res) => {
  try {
    const {
      message,
      role = "user",
      customerId = "CUST-001",
      sessionId = "default"
    } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        error: "message must be a non-empty string"
      });
    }

    const result = await runAgent({
      input: message,
      role,
      customerId,
      sessionId
    });

    return res.json(result);
  } catch (error) {
    return res.status(500).json({
      error: "Agent execution failed"
    });
  }
});
