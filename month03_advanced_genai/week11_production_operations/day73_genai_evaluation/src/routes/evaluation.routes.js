import express from "express";

import { evaluateAnswer, evaluateRetrieval } from "../evaluation/evaluator.js";

import { generateAnswer } from "../services/llm.service.js";

const router = express.Router();

/*
  POST /api/evaluation/evaluate

  Evaluate an already-generated answer.

  Body:
  {
    "question": "...",
    "expectedAnswer": "...",
    "actualAnswer": "...",
    "context": "..."
  }
*/
router.post("/evaluate", async (req, res) => {
  try {
    const { question, expectedAnswer, actualAnswer, context = null } = req.body;

    if (!question) {
      return res.status(400).json({
        error: "question is required",
      });
    }

    if (!expectedAnswer) {
      return res.status(400).json({
        error: "expectedAnswer is required",
      });
    }

    if (!actualAnswer) {
      return res.status(400).json({
        error: "actualAnswer is required",
      });
    }

    const result = await evaluateAnswer({
      question,
      expectedAnswer,
      actualAnswer,
      context,
    });

    return res.status(200).json({
      success: true,
      question,
      expectedAnswer,
      actualAnswer,
      evaluation: result,
    });
  } catch (error) {
    console.error("Evaluation error:", error);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/*
  POST /api/evaluation/generate-and-evaluate

  Generate an answer with Groq and then evaluate it.
*/
router.post("/generate-and-evaluate", async (req, res) => {
  try {
    const { question, expectedAnswer, context = null } = req.body;

    if (!question) {
      return res.status(400).json({
        error: "question is required",
      });
    }

    if (!expectedAnswer) {
      return res.status(400).json({
        error: "expectedAnswer is required",
      });
    }

    const generated = await generateAnswer({
      question,
      context,
    });

    const evaluation = await evaluateAnswer({
      question,
      expectedAnswer,
      actualAnswer: generated.answer,
      context,
    });

    return res.status(200).json({
      success: true,

      question,

      expectedAnswer,

      actualAnswer: generated.answer,

      generation: {
        model: generated.model,
        latencyMs: generated.latencyMs,
        usage: generated.usage,
      },

      evaluation,
    });
  } catch (error) {
    console.error("Generate + evaluation error:", error);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/*
  POST /api/evaluation/retrieval

  Evaluate RAG retrieval.
*/
router.post("/retrieval", async (req, res) => {
  try {
    const { retrievedDocuments, relevantDocuments, k } = req.body;

    if (!Array.isArray(retrievedDocuments)) {
      return res.status(400).json({
        error: "retrievedDocuments must be an array",
      });
    }

    if (!Array.isArray(relevantDocuments)) {
      return res.status(400).json({
        error: "relevantDocuments must be an array",
      });
    }

    const result = evaluateRetrieval({
      retrievedDocuments,
      relevantDocuments,
      k,
    });

    return res.status(200).json({
      success: true,

      retrievedDocuments,

      relevantDocuments,

      evaluation: result,
    });
  } catch (error) {
    console.error("Retrieval evaluation error:", error);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
