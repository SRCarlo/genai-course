import { Router } from "express";

import Groq from "groq-sdk";

import { env } from "../config/env.js";

import { logger } from "../middleware/logger.js";

import { startTimer, elapsedMs } from "../utils/timer.js";

import { safeTextMetadata } from "../utils/redaction.js";

import {
  recordAIUsage,
  recordRagUsage,
  recordAgentRun,
  recordAgentIteration,
  recordToolCall,
} from "../services/metrics.service.js";

import { withSpan } from "../services/tracing.service.js";

import { evaluateAlerts } from "../services/alert.service.js";

const router = Router();

const groq = env.groqApiKey
  ? new Groq({
      apiKey: env.groqApiKey,
    })
  : null;

function calculateCost(inputTokens, outputTokens) {
  const inputCost = (inputTokens / 1_000_000) * env.inputPricePerMillion;

  const outputCost = (outputTokens / 1_000_000) * env.outputPricePerMillion;

  return inputCost + outputCost;
}

/*
 * POST /api/chat
 *
 * Example:
 *
 * {
 *   "message": "Explain observability in simple terms",
 *   "tenantId": "tenant_123"
 * }
 */
router.post("/chat", async (req, res, next) => {
  const requestStart = startTimer();

  const { message, tenantId = "demo-tenant" } = req.body;

  if (typeof message !== "string" || message.trim().length === 0) {
    return res.status(400).json({
      error: "message_required",
      requestId: req.requestId,
    });
  }

  if (!groq) {
    return res.status(503).json({
      error: "groq_not_configured",
      requestId: req.requestId,
    });
  }

  let aiSuccess = false;
  let inputTokens = 0;
  let outputTokens = 0;
  let costUsd = 0;

  try {
    const result = await withSpan(
      "genai.chat",
      {
        "genai.system": "Groq",

        "genai.request.model": env.groqModel,

        "genai.request.id": req.requestId,

        "genai.tenant.id": tenantId,

        "genai.input.length": message.length,
      },
      async (span) => {
        const aiStart = startTimer();

        logger.info("AI request started", {
          requestId: req.requestId,

          correlationId: req.correlationId,

          tenantId,

          model: env.groqModel,

          ...safeTextMetadata(message),
        });

        const completion = await groq.chat.completions.create({
          model: env.groqModel,

          messages: [
            {
              role: "system",

              content:
                "You are a helpful production engineering assistant. Give concise and technically accurate answers.",
            },
            {
              role: "user",

              content: message,
            },
          ],

          temperature: 0.2,

          max_completion_tokens: 1024,
        });

        const aiLatencyMs = elapsedMs(aiStart);

        const usage = completion.usage || {};

        inputTokens = usage.prompt_tokens || 0;

        outputTokens = usage.completion_tokens || 0;

        costUsd = calculateCost(inputTokens, outputTokens);

        aiSuccess = true;

        span.setAttributes({
          "genai.usage.input_tokens": inputTokens,

          "genai.usage.output_tokens": outputTokens,

          "genai.usage.total_tokens": inputTokens + outputTokens,

          "genai.cost.usd": costUsd,

          "genai.latency_ms": aiLatencyMs,
        });

        recordAIUsage({
          model: env.groqModel,

          tenantId,

          inputTokens,

          outputTokens,

          costUsd,

          latencyMs: aiLatencyMs,

          success: true,
        });

        logger.info("AI request completed", {
          requestId: req.requestId,

          correlationId: req.correlationId,

          tenantId,

          model: env.groqModel,

          latencyMs: Number(aiLatencyMs.toFixed(2)),

          inputTokens,

          outputTokens,

          costUsd: Number(costUsd.toFixed(6)),
        });

        return completion;
      },
    );

    /*
     * Demonstration RAG telemetry.
     *
     * There is no vector database in this
     * Day 72 project yet.
     *
     * We record the structure so that when
     * you add Pinecone/Qdrant/pgvector/etc.
     * you can replace this section.
     */
    const ragStart = startTimer();

    const retrievedDocuments = 0;

    const ragLatencyMs = elapsedMs(ragStart);

    recordRagUsage({
      latencyMs: ragLatencyMs,

      documentsRetrieved: retrievedDocuments,

      success: true,
    });

    /*
     * Demonstration agent telemetry.
     *
     * This endpoint isn't an agent loop yet,
     * but the instrumentation primitives exist.
     */
    recordAgentRun();

    recordAgentIteration();

    recordToolCall({
      success: true,
    });

    const totalLatencyMs = elapsedMs(requestStart);

    evaluateAlerts();

    res.json({
      success: true,

      requestId: req.requestId,

      correlationId: req.correlationId,

      model: env.groqModel,

      response: result.choices?.[0]?.message?.content || "",

      usage: {
        inputTokens,
        outputTokens,
        totalTokens: inputTokens + outputTokens,
      },

      costUsd: Number(costUsd.toFixed(6)),

      latencyMs: Number(totalLatencyMs.toFixed(2)),
    });
  } catch (error) {
    const totalLatencyMs = elapsedMs(requestStart);

    costUsd = calculateCost(inputTokens, outputTokens);

    recordAIUsage({
      model: env.groqModel,

      tenantId,

      inputTokens,

      outputTokens,

      costUsd,

      latencyMs: totalLatencyMs,

      success: false,
    });

    logger.error("AI request failed", {
      requestId: req.requestId,

      correlationId: req.correlationId,

      tenantId,

      model: env.groqModel,

      latencyMs: Number(totalLatencyMs.toFixed(2)),

      error: error.message,
    });

    next(error);
  }
});

export default router;
