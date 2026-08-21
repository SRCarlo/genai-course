import express from "express";

import { authenticate } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorize.js";
import { requireTenant } from "../middleware/tenant.js";
import { rateLimiter } from "../middleware/rateLimiter.js";
import { validateChatInput } from "../middleware/validate.js";

import { checkAndConsumeQuota } from "../services/quota.service.js";
import { generateTenantAwareAnswer } from "../services/ai.service.js";

const router = express.Router();

router.post(
  "/chat",

  /*
   * 1. Who are you?
   */
  authenticate,

  /*
   * 2. What tenant do you belong to?
   */
  requireTenant,

  /*
   * 3. Are you allowed to use chat?
   */
  authorize("user", "admin"),

  /*
   * 4. Prevent abuse.
   */
  rateLimiter,

  /*
   * 5. Validate request.
   */
  validateChatInput,

  async (req, res, next) => {
    try {
      /*
       * 6. Check AI quota.
       */
      const quota = checkAndConsumeQuota({
        userId: req.user.id,
        tenantId: req.tenantId,
        plan: req.user.plan,
      });

      if (!quota.allowed) {
        return res.status(429).json({
          error: "AI daily quota exceeded",
          quota,
        });
      }

      /*
       * 7. Tenant-aware RAG + Groq.
       */
      const result = await generateTenantAwareAnswer({
        message: req.body.message,
        tenantId: req.tenantId,
      });

      res.json({
        answer: result.answer,

        securityContext: {
          userId: req.user.id,
          tenantId: req.tenantId,
          role: req.user.role,
        },

        quota: {
          used: quota.used,
          limit: quota.limit,
        },

        model: result.model,
      });
    } catch (error) {
      next(error);
    }
  },
);

export default router;
