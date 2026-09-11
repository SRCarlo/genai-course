import "dotenv/config";

import express from "express";

import { createAndRunAgent } from "./agent/agent.js";

import {
  approveRequest,
  rejectRequest,
  getApproval,
} from "./security/approval.js";

const app = express();

app.use(express.json());

const PORT = Number(process.env.PORT) || 3000;

app.get("/health", (req, res) => {
  res.json({
    success: true,
    service: "Day 90 Agent Execution Runtime",
    model: process.env.GROQ_MODEL || "openai/gpt-oss-20b",
    provider: "Groq",
    timestamp: new Date().toISOString(),
  });
});

app.post("/agent/run", async (req, res) => {
  try {
    const { goal } = req.body;

    if (typeof goal !== "string" || !goal.trim()) {
      return res.status(400).json({
        success: false,
        error: "goal is required",
      });
    }

    const state = await createAndRunAgent(goal);

    return res.json({
      success: true,
      state,
    });
  } catch (error) {
    console.error("Agent error:", error);

    return res.status(500).json({
      success: false,
      error: error.message,
      code: error.code || "AGENT_EXECUTION_ERROR",
    });
  }
});

app.get("/approvals/:approvalId", (req, res) => {
  const approval = getApproval(req.params.approvalId);

  if (!approval) {
    return res.status(404).json({
      success: false,
      error: "Approval not found",
    });
  }

  res.json({
    success: true,
    approval,
  });
});

app.post("/approvals/:approvalId/approve", (req, res) => {
  try {
    const approval = approveRequest(req.params.approvalId);

    res.json({
      success: true,
      approval,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      error: error.message,
    });
  }
});

app.post("/approvals/:approvalId/reject", (req, res) => {
  try {
    const approval = rejectRequest(req.params.approvalId);

    res.json({
      success: true,
      approval,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      error: error.message,
    });
  }
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
  });
});

app.listen(PORT, () => {
  console.log("__________________________________________________");

  console.log(" DAY 90 AI AGENT RUNTIME");

  console.log("__________________________________________________");

  console.log(`Server: http://localhost:${PORT}`);

  console.log(`Model: ${process.env.GROQ_MODEL || "openai/gpt-oss-20b"}`);

  console.log("Provider: Groq");

  console.log(
    `Groq API Key loaded: ${process.env.GROQ_API_KEY ? "YES" : "NO"}`,
  );

  console.log("__________________________________________________");
});
