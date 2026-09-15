import "dotenv/config";
import express from "express";

import { runAgent } from "./agent/agent.js";
import { createMetrics, getMetricsSnapshot } from "./observability/metrics.js";

const app = express();

app.use(express.json());

const metrics = createMetrics();

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "day94-agent-observability",
  });
});

app.post("/api/agent/run", async (req, res) => {
  const { message } = req.body;

  if (!message || typeof message !== "string") {
    return res.status(400).json({
      error: "message is required",
    });
  }

  try {
    const result = await runAgent(message, {
      metrics,
    });

    res.json({
      success: true,
      answer: result.answer,
      trace: result.trace,
      metrics: getMetricsSnapshot(metrics),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      metrics: getMetricsSnapshot(metrics),
    });
  }
});

app.get("/api/observability/metrics", (req, res) => {
  res.json(getMetricsSnapshot(metrics));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(
    `Day 94 Agent Observability API running on http://localhost:${PORT}`,
  );
});
