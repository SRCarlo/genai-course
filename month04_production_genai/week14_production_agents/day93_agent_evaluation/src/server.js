import "dotenv/config";
import express from "express";
import fs from "node:fs/promises";

import { executeAgent } from "./agent/agent.js";
import { evaluateCase } from "./evaluation/evaluator.js";
import { judgeAnswer } from "./evaluation/judge.js";

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

/*
|--------------------------------------------------------------------------
| Health Check
|--------------------------------------------------------------------------
*/

app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Day 93 Agent Evaluation API is running",
    model: process.env.GROQ_MODEL || "openai/gpt-oss-20b",
  });
});

/*
|--------------------------------------------------------------------------
| Run Agent
|--------------------------------------------------------------------------
|
| POST /agent
|
| Body:
| {
|   "input": "What is Node.js?"
| }
|
*/

app.post("/agent", async (req, res) => {
  try {
    const { input, context = "" } = req.body;

    if (!input || typeof input !== "string") {
      return res.status(400).json({
        success: false,
        error: "input is required and must be a string",
      });
    }

    const start = Date.now();

    const result = await executeAgent(input, context);

    const latencyMs = Date.now() - start;

    return res.json({
      success: true,
      input,
      output: result.output,
      toolCalls: result.toolCalls,
      latencyMs,
      usage: result.usage,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/*
|--------------------------------------------------------------------------
| Evaluate One Case
|--------------------------------------------------------------------------
|
| POST /evaluate-case
|
| Body:
| {
|   "input": "What is Node.js?",
|   "category": "basic",
|   "expected": {
|     "requiredTerms": ["JavaScript", "runtime"],
|     "forbiddenTerms": [],
|     "expectedTool": null,
|     "expectedToolArgs": null,
|     "mustRefuse": false,
|     "requiredFields": []
|   }
| }
|
*/

app.post("/evaluate-case", async (req, res) => {
  try {
    const { input, category = "basic", expected = {}, context = "" } = req.body;

    if (!input || typeof input !== "string") {
      return res.status(400).json({
        success: false,
        error: "input is required and must be a string",
      });
    }

    const start = Date.now();

    const agentResult = await executeAgent(input, context);

    const latencyMs = Date.now() - start;

    const testCase = {
      id: req.body.id || `manual-${Date.now()}`,
      input,
      category,
      context,
      expected: {
        requiredTerms: expected.requiredTerms || [],
        forbiddenTerms: expected.forbiddenTerms || [],
        expectedTool: expected.expectedTool ?? null,
        expectedToolArgs: expected.expectedToolArgs ?? null,
        mustRefuse: expected.mustRefuse || false,
        requiredFields: expected.requiredFields || [],
      },
    };

    const evaluation = await evaluateCase(
      testCase,
      {
        output: agentResult.output,
        toolCalls: agentResult.toolCalls,
        usage: agentResult.usage,
        latencyMs,
      },
      {
        useJudge: true,
        judge: judgeAnswer,
      },
    );

    return res.json({
      success: true,
      evaluation,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/*
|--------------------------------------------------------------------------
| Run Existing Dataset Case
|--------------------------------------------------------------------------
|
| POST /evaluate-dataset-case
|
| Body:
| {
|   "file": "dataset/basic.json",
|   "id": "001"
| }
|
*/

app.post("/evaluate-dataset-case", async (req, res) => {
  try {
    const { file = "dataset/basic.json", id } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: "id is required",
      });
    }

    const content = await fs.readFile(file, "utf8");
    const dataset = JSON.parse(content);

    const testCase = dataset.find((item) => item.id === id);

    if (!testCase) {
      return res.status(404).json({
        success: false,
        error: `Test case ${id} not found`,
      });
    }

    const start = Date.now();

    const agentResult = await executeAgent(
      testCase.input,
      testCase.context || "",
    );

    const latencyMs = Date.now() - start;

    const evaluation = await evaluateCase(
      testCase,
      {
        output: agentResult.output,
        toolCalls: agentResult.toolCalls,
        usage: agentResult.usage,
        latencyMs,
      },
      {
        useJudge: true,
        judge: judgeAnswer,
      },
    );

    return res.json({
      success: true,
      testCase,
      evaluation,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/*
|--------------------------------------------------------------------------
| Start Server
|--------------------------------------------------------------------------
*/

app.listen(PORT, () => {
  console.log("");
  console.log("==========================================");
  console.log("   DAY 93 AGENT EVALUATION API");
  console.log("==========================================");
  console.log(`Server: http://localhost:${PORT}`);
  console.log(`Model:  ${process.env.GROQ_MODEL || "openai/gpt-oss-20b"}`);
  console.log("");
  console.log("Available endpoints:");
  console.log(`GET  http://localhost:${PORT}/health`);
  console.log(`POST http://localhost:${PORT}/agent`);
  console.log(`POST http://localhost:${PORT}/evaluate-case`);
  console.log(`POST http://localhost:${PORT}/evaluate-dataset-case`);
  console.log("==========================================");
});
