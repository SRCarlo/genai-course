import express from "express";
import { config, validateConfig } from "../config.js";
import { TenantStore } from "../tenants/tenant-store.js";
import { UsageStore } from "../usage/usage-store.js";
import { UsageMeter } from "../usage/usage-meter.js";
import { UsageService } from "../usage/usage-service.js";
import { QuotaService } from "../quotas/quota-service.js";
import { FixedWindowRateLimiter } from "../rate-limit/fixed-window.js";
import { SlidingWindowRateLimiter } from "../rate-limit/sliding-window.js";
import { calculateCost } from "../billing/cost-calculator.js";
import { AIService } from "../ai/ai-service.js";
import { authenticate } from "../middleware/auth.js";
import { rateLimit } from "../middleware/rate-limiter.js";
import { usageContext } from "../middleware/usage-context.js";
import { requireQuota } from "../middleware/quota-check.js";

validateConfig();

const app = express();
app.use(express.json({ limit: "64kb" }));

const tenantStore = new TenantStore({
  defaultTenantId: config.defaultTenantId,
  defaultUserId: config.defaultUserId,
  defaultApiKeyId: config.defaultApiKeyId,
  demoApiKey: config.demoApiKey
});

const usageStore = new UsageStore();
const usageMeter = new UsageMeter(usageStore);
const usageService = new UsageService(usageStore);
const quotaService = new QuotaService(usageService);

const tenantRateLimiter = new SlidingWindowRateLimiter({
  limit: 300,
  windowMs: 60_000
});

const apiKeyRateLimiter = new FixedWindowRateLimiter({
  limit: 60,
  windowMs: 60_000
});

const aiService = new AIService({
  apiKey: config.groqApiKey,
  model: config.groqModel
});

const authMiddleware = authenticate({ tenantStore });

app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    service: "day116-usage-metering",
    model: config.groqModel
  });
});

app.use(usageContext());
app.use(authMiddleware);

app.post(
  "/v1/chat",
  rateLimit({
    limiter: apiKeyRateLimiter,
    getKey: (req) => `api-key:${req.identity.apiKeyId}`
  }),
  rateLimit({
    limiter: tenantRateLimiter,
    getKey: (req) => `tenant:${req.identity.tenantId}`
  }),
  requireQuota({
    quotaService,
    getEstimatedTokens: (req) =>
      aiService.estimateInputTokens(req.body?.prompt ?? "") + 512
  }),
  async (req, res, next) => {
    try {
      const prompt = req.body?.prompt;

      if (typeof prompt !== "string" || prompt.trim().length === 0) {
        return res.status(400).json({
          error: "invalid_request",
          message: "prompt must be a non-empty string."
        });
      }

      if (prompt.length > 20_000) {
        return res.status(400).json({
          error: "invalid_request",
          message: "prompt must be 20,000 characters or less."
        });
      }

      const result = await aiService.generate({
        prompt: prompt.trim()
      });

      const cost = calculateCost({
        model: result.model,
        inputTokens: result.usage.inputTokens,
        outputTokens: result.usage.outputTokens
      });

      const usage = usageMeter.record({
        requestId: req.requestId,
        tenantId: req.identity.tenantId,
        userId: req.identity.userId,
        apiKeyId: req.identity.apiKeyId,
        operation: "chat",
        model: result.model,
        inputTokens: result.usage.inputTokens,
        outputTokens: result.usage.outputTokens,
        latencyMs: result.latencyMs,
        cost
      });

      return res.json({
        requestId: req.requestId,
        response: result.response,
        model: result.model,
        usage: {
          inputTokens: usage.inputTokens,
          outputTokens: usage.outputTokens,
          totalTokens: usage.totalTokens
        },
        cost
      });
    } catch (error) {
      next(error);
    }
  }
);

app.get("/v1/usage", (req, res) => {
  const tenantId = req.identity.tenantId;
  const plan = quotaService.getPlan(req.identity.plan);
  const usage = usageService.getTenantUsage(tenantId);

  res.json({
    tenantId,
    plan: req.identity.plan,
    requests: {
      used: usage.requests,
      limit: plan.monthlyRequests,
      remaining: Math.max(plan.monthlyRequests - usage.requests, 0)
    },
    tokens: {
      used: usage.totalTokens,
      limit: plan.monthlyTokens,
      remaining: Math.max(plan.monthlyTokens - usage.totalTokens, 0)
    },
    inputTokens: usage.inputTokens,
    outputTokens: usage.outputTokens,
    estimatedCost: usage.estimatedCost,
    totalLatencyMs: usage.latencyMs
  });
});

app.get("/v1/usage/models", (req, res) => {
  res.json({
    tenantId: req.identity.tenantId,
    models: usageService.getModelUsage(req.identity.tenantId)
  });
});

app.get("/v1/usage/api-keys", (req, res) => {
  res.json({
    tenantId: req.identity.tenantId,
    keys: usageService.getApiKeyUsageByTenant(req.identity.tenantId)
  });
});

app.get("/v1/usage/users", (req, res) => {
  res.json({
    tenantId: req.identity.tenantId,
    users: usageService.getUserUsageByTenant(req.identity.tenantId)
  });
});

app.get("/v1/usage/me", (req, res) => {
  res.json({
    userId: req.identity.userId,
    apiKeyId: req.identity.apiKeyId,
    usage: usageService.getUserUsage(req.identity.userId)
  });
});

app.use((error, _req, res, _next) => {
  console.error(error);

  if (error?.status === 429) {
    return res.status(429).json({
      error: "provider_rate_limit",
      message: "The AI provider rate limit was reached."
    });
  }

  return res.status(500).json({
    error: "internal_server_error",
    message: error?.message ?? "Unexpected server error."
  });
});

app.listen(config.port, () => {
  console.log(`Day 116 server running on http://localhost:${config.port}`);
  console.log(`Groq model: ${config.groqModel}`);
});
