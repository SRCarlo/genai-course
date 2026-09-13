import express from "express";
import dotenv from "dotenv";

import { runMultiAgentWorkflow } from "./workflow/multi-agent.workflow.js";

import { getWorkflow } from "./storage/workflow.store.js";

dotenv.config();

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

/*
 * ==================================
 * HOME
 * ==================================
 */

app.get("/", (req, res) => {
  res.json({
    message: "Day 92 Multi-Agent Research Assistant",

    provider: "Groq",

    model: "openai/gpt-oss-20b",

    architecture:
      "Supervisor → Parallel Research → Analysis → Reviewer → Writer",
  });
});

/*
 * ==================================
 * CREATE RESEARCH WORKFLOW
 * ==================================
 */

app.post("/api/research", async (req, res) => {
  try {
    const { task } = req.body;

    if (!task || typeof task !== "string" || task.trim().length === 0) {
      return res.status(400).json({
        error: "task is required",
      });
    }

    console.log("\n=================================");

    console.log("Starting Multi-Agent Workflow");

    console.log("=================================\n");

    const result = await runMultiAgentWorkflow(task);

    res.json({
      workflowId: result.workflowId,

      status: result.status,

      result: result.finalAnswer,

      research: result.research,

      analysis: result.analysis,

      review: result.review,

      budget: result.budget,

      trace: result.trace,

      error: result.error ?? null,
    });
  } catch (error) {
    console.error("API Error:", error);

    res.status(500).json({
      error: "Workflow failed",

      message: error.message,
    });
  }
});

/*
 * ==================================
 * GET WORKFLOW
 * ==================================
 */

app.get("/api/workflows/:id", (req, res) => {
  const workflow = getWorkflow(req.params.id);

  if (!workflow) {
    return res.status(404).json({
      error: "Workflow not found",
    });
  }

  res.json(workflow);
});

/*
 * ==================================
 * HEALTH CHECK
 * ==================================
 */

app.get("/health", (req, res) => {
  res.json({
    status: "UP",

    provider: "Groq",

    model: "openai/gpt-oss-20b",
  });
});

/*
 * ==================================
 * SERVER
 * ==================================
 */

app.listen(PORT, () => {
  console.log(`\nServer running at http://localhost:${PORT}`);

  console.log(`Health: http://localhost:${PORT}/health`);

  console.log(`Model: openai/gpt-oss-20b`);

  console.log(`Provider: Groq\n`);
});
