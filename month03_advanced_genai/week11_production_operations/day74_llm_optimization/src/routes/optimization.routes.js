import express from "express";
import { randomUUID } from "crypto";
import { z } from "zod";
import { generateStructuredOutput } from "../services/llm.service.js";

import { runBenchmark } from "../evaluation/benchmark.js";
import { chooseModel } from "../services/routing.service.js";

const router = express.Router();

const experiments = new Map();

router.post("/experiments", async (req, res) => {
  try {
    const {
      promptVersion = "v1",
      model = process.env.GROQ_MODEL || "openai/gpt-oss-20b",
      dataset = "benchmark-v1",
      temperature = 0.3,
    } = req.body;

    const experimentId = `exp_${randomUUID().slice(0, 8)}`;

    experiments.set(experimentId, {
      experimentId,
      promptVersion,
      model,
      dataset,
      temperature,
      status: "created",
      createdAt: new Date().toISOString(),
    });

    res.status(201).json({
      experimentId,
      status: "created",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

router.post("/experiments/:id/run", async (req, res) => {
  try {
    const experiment = experiments.get(req.params.id);

    if (!experiment) {
      return res.status(404).json({
        error: "Experiment not found",
      });
    }

    experiment.status = "running";

    const result = await runBenchmark({
      promptVersion: experiment.promptVersion,
      model: experiment.model,
      temperature: experiment.temperature,
    });

    experiment.status = "completed";
    experiment.result = result;
    experiment.completedAt = new Date().toISOString();

    res.json(experiment);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

router.get("/experiments/:id", (req, res) => {
  const experiment = experiments.get(req.params.id);

  if (!experiment) {
    return res.status(404).json({
      error: "Experiment not found",
    });
  }

  res.json(experiment);
});

router.post("/route", (req, res) => {
  const {
    input,
    qualityRequirement = 0.9,
    costBudget = 0.005,
    latencyBudgetMs = 2000,
  } = req.body;

  if (!input) {
    return res.status(400).json({
      error: "input is required",
    });
  }

  const decision = chooseModel({
    input,
    qualityRequirement,
    costBudget,
    latencyBudgetMs,
  });

  res.json(decision);
});

router.post("/structured-output", async (req, res) => {
  try {
    const { input } = req.body;

    if (!input) {
      return res.status(400).json({
        error: "input is required",
      });
    }

    const schema = {
      type: "object",
      properties: {
        category: {
          type: "string",
          enum: ["authentication", "billing", "technical", "general"],
        },
        confidence: {
          type: "number",
          minimum: 0,
          maximum: 1,
        },
        answer: {
          type: "string",
        },
      },
      required: ["category", "confidence", "answer"],
      additionalProperties: false,
    };

    const result = await generateStructuredOutput({
      systemPrompt: `
You classify technical support requests.

Return:
- category
- confidence
- answer

Follow the supplied schema exactly.
        `,
      userInput: input,
      schema,
      schemaName: "support_classification",
    });

    const ValidationSchema = z.object({
      category: z.enum(["authentication", "billing", "technical", "general"]),
      confidence: z.number().min(0).max(1),
      answer: z.string().min(1),
    });

    const validated = ValidationSchema.parse(result.data);

    res.json({
      success: true,
      data: validated,
      metrics: {
        latencyMs: result.latencyMs,
        inputTokens: result.inputTokens,
        outputTokens: result.outputTokens,
        costPerRequest: result.costPerRequest,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
