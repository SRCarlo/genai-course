import "dotenv/config";

import express from "express";

import { observabilityMiddleware } from "./middleware/observabilityMiddleware.js";

import { runAgent } from "./agent/agent.js";

import { getTrace, getAllTraces } from "./traces/traceStore.js";

import { getMetrics } from "./metrics/metricsStore.js";

import { info, error as logError } from "./observability/logger.js";

const app = express();

const PORT = process.env.PORT || 3000;

/*
 * JSON body parser
 */
app.use(
  express.json({
    limit: "1mb",
  }),
);

/*
 * Observability middleware
 *
 * Every request gets:
 * - requestId
 * - traceId
 * - trace object
 */
app.use(observabilityMiddleware);

/*
 * --------------------------------
 * HEALTH CHECK
 * --------------------------------
 */
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
  });
});

/*
 * --------------------------------
 * AGENTIC RAG
 * --------------------------------
 */
app.post("/api/agentic-rag", async (req, res) => {
  const { question } = req.body;

  /*
   * Validate question
   */
  if (!question || typeof question !== "string") {
    return res.status(400).json({
      error: "question is required",

      requestId: req.requestId,

      traceId: req.trace.traceId,
    });
  }

  info("agent.request", {
    requestId: req.requestId,

    traceId: req.trace.traceId,
  });

  try {
    /*
     * Run Day 63 agent
     * with Day 65 trace.
     */
    const result = await runAgent(question, {
      trace: req.trace,
    });

    /*
     * Return result.
     *
     * The middleware's "finish"
     * event will finalize the trace.
     */
    return res.json({
      answer: result.answer,

      sources: result.sources,

      calculation: result.calculation,

      requestId: req.requestId,

      traceId: req.trace.traceId,

      summary: {
        /*
         * This value can still be
         * approximately zero here
         * because the HTTP response
         * has not finished yet.
         *
         * The final trace endpoint
         * will contain the actual
         * latency.
         */
        latencyMs: req.trace.latencyMs,

        llmCalls: req.trace.summary.llmCalls,

        toolCalls: req.trace.summary.toolCalls,

        ragCalls: req.trace.summary.ragCalls,

        inputTokens: req.trace.summary.inputTokens,

        outputTokens: req.trace.summary.outputTokens,

        totalTokens: req.trace.summary.totalTokens,

        status: "success",
      },
    });
  } catch (error) {
    /*
     * Record error in structured logs.
     *
     * Do not expose internal
     * error details to the user.
     */
    logError("agent.request.failed", {
      requestId: req.requestId,

      traceId: req.trace.traceId,

      error: error.message,

      errorType: error.constructor?.name,
    });

    /*
     * Trace will be finalized
     * as "error" by middleware
     * because HTTP status is 500.
     */
    return res.status(500).json({
      error: "Unable to process the request.",

      requestId: req.requestId,

      traceId: req.trace.traceId,
    });
  }
});

/*
 * --------------------------------
 * LIST ALL TRACES
 * --------------------------------
 *
 * Development/debug endpoint.
 */
app.get("/debug/traces", (req, res) => {
  const traces = getAllTraces();

  res.json({
    count: traces.length,

    traces: traces.map((trace) => ({
      traceId: trace.traceId,

      status: trace.status,

      latencyMs: trace.latencyMs,

      spanCount: trace.spans.length,

      summary: trace.summary,
    })),
  });
});

/*
 * --------------------------------
 * GET SINGLE TRACE
 * --------------------------------
 */
app.get("/debug/traces/:traceId", (req, res) => {
  const { traceId } = req.params;

  const trace = getTrace(traceId);

  if (!trace) {
    return res.status(404).json({
      error: "Trace not found",

      requestedTraceId: traceId,
    });
  }

  return res.json(trace);
});

/*
 * --------------------------------
 * METRICS
 * --------------------------------
 */
app.get("/metrics", (req, res) => {
  res.json(getMetrics());
});

/*
 * --------------------------------
 * GLOBAL ERROR HANDLER
 * --------------------------------
 */
app.use((err, req, res, next) => {
  logError("server.unhandled_error", {
    requestId: req.requestId,

    traceId: req.trace?.traceId,

    error: err.message,

    errorType: err.constructor?.name,
  });

  return res.status(500).json({
    error: "Internal server error",

    requestId: req.requestId,

    traceId: req.trace?.traceId,
  });
});

/*
 * --------------------------------
 * START SERVER
 * --------------------------------
 */
app.listen(PORT, () => {
  console.log(`Day 65 server running on http://localhost:${PORT}`);
});
