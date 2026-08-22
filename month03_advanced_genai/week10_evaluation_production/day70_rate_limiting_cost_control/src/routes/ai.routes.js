import express from "express";

import { authenticate } from "../middleware/auth.js";
import { rateLimiter } from "../middleware/rateLimiter.js";
import { modelPolicy } from "../middleware/modelPolicy.js";
import { promptValidation } from "../middleware/promptValidation.js";
import { quotaCheck } from "../middleware/quota.js";
import { concurrencyLimiter } from "../middleware/concurrency.js";

import { generateChat } from "../services/groq.service.js";

import { calculateRequestCost } from "../services/cost.service.js";

import { recordUsage } from "../services/usage.service.js";

import crypto from "crypto";

const router = express.Router();

router.post(
  "/chat",

  authenticate,

  rateLimiter,

  modelPolicy,

  promptValidation,

  quotaCheck,

  concurrencyLimiter,

  async (req, res, next) => {
    try {
      const requestId = `req_${crypto.randomUUID()}`;

      /*
       * Call Groq.
       */
      const result = await generateChat({
        prompt: req.body.prompt,

        model: req.model,

        maxOutputTokens: req.plan.maxOutputTokens,
      });

      /*
       * Calculate estimated cost.
       */
      const cost = calculateRequestCost(result.usage, result.model);

      /*
       * Record usage.
       */
      const usageRecord = recordUsage({
        requestId,

        userId: req.user.id,

        tenantId: req.user.tenantId,

        model: result.model,

        inputTokens: result.usage.inputTokens,

        outputTokens: result.usage.outputTokens,

        totalTokens: result.usage.totalTokens,

        cost: cost.estimatedCost,
      });

      return res.status(200).json({
        success: true,

        requestId,

        model: result.model,

        response: result.text,

        usage: result.usage,

        cost: {
          estimated: cost.estimatedCost,

          currency: "USD",
        },

        usageRecord: {
          recordedAt: usageRecord.recordedAt,
        },
      });
    } catch (error) {
      next(error);
    }
  },
);

export default router;
