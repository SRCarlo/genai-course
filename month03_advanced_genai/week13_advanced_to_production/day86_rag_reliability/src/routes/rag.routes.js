import { Router } from "express";

import { processRagQuery } from "../services/rag.service.js";

import { ragRateLimiter } from "../security/rate.limit.js";

import {
  createRequestId,
  startTrace,
  endTrace,
} from "../observability/trace.js";

import {
  recordRequest,
  recordSuccess,
  recordFailure,
  recordLatency,
} from "../observability/metrics.js";

import { logger } from "../observability/logger.js";

const router = Router();

router.post(
  "/query",

  ragRateLimiter,

  async (req, res, next) => {
    const requestId = createRequestId();

    const trace = startTrace();

    recordRequest();

    res.setHeader("X-Request-ID", requestId);

    try {
      const result = await processRagQuery(req.body);

      const latency = endTrace(trace);

      recordLatency(latency);

      recordSuccess();

      logger.info("rag_request_completed", {
        requestId,
        latencyMs: latency,
      });

      res.status(200).json({
        requestId,
        ...result,
      });
    } catch (error) {
      const latency = endTrace(trace);

      recordLatency(latency);

      recordFailure();

      logger.error("rag_request_failed", {
        requestId,
        latencyMs: latency,

        error: error.message,
      });

      next(error);
    }
  },
);

export default router;
