import { createTrace, finishTrace } from "../observability/tracer.js";

import { createRequestId } from "../observability/requestContext.js";

import { saveTrace } from "../traces/traceStore.js";

import { recordRequest } from "../metrics/metricsStore.js";

import { info } from "../observability/logger.js";

export function observabilityMiddleware(req, res, next) {
  req.requestId = createRequestId();

  req.trace = createTrace();

  const requestStartedAt = Date.now();

  info("request.started", {
    requestId: req.requestId,

    traceId: req.trace.traceId,

    method: req.method,

    route: req.originalUrl,
  });

  res.on("finish", () => {
    const latencyMs = Date.now() - requestStartedAt;

    const status = res.statusCode >= 400 ? "error" : "success";

    finishTrace(req.trace, status);

    req.trace.latencyMs = latencyMs;

    /*
     * Important:
     * Save the FINAL version of the trace
     * after the response has completed.
     */
    saveTrace(req.trace);

    recordRequest({
      status,

      latencyMs,

      llmCalls: req.trace.summary.llmCalls,

      ragCalls: req.trace.summary.ragCalls,

      toolCalls: req.trace.summary.toolCalls,

      inputTokens: req.trace.summary.inputTokens,

      outputTokens: req.trace.summary.outputTokens,

      totalTokens: req.trace.summary.totalTokens,
    });

    info("request.finished", {
      requestId: req.requestId,

      traceId: req.trace.traceId,

      status,

      latencyMs,

      llmCalls: req.trace.summary.llmCalls,

      ragCalls: req.trace.summary.ragCalls,

      toolCalls: req.trace.summary.toolCalls,

      inputTokens: req.trace.summary.inputTokens,

      outputTokens: req.trace.summary.outputTokens,

      totalTokens: req.trace.summary.totalTokens,
    });
  });

  next();
}
