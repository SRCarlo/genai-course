import express from "express";
import Groq from "groq-sdk";

import { config } from "../config/config.js";
import { TenantRegistry } from "../tenants/tenant-registry.js";
import { TenantResolver } from "../tenants/tenant-resolver.js";
import { TenantPolicy } from "../tenants/tenant-policy.js";
import { ApiKeyService } from "../auth/api-key.js";
import { createAuthenticationMiddleware } from "../auth/authentication.js";
import { UserRegistry } from "../users/user-registry.js";
import { ModelPolicy } from "../models/model-policy.js";
import { TenantRateLimiter } from "../limits/rate-limiter.js";
import { BudgetManager } from "../limits/budget-manager.js";
import { UsageMeter } from "../usage/usage-meter.js";
import { CostTracker } from "../cost/cost-tracker.js";
import { TenantRAG } from "../rag/tenant-rag.js";
import { TenantCache } from "../cache/tenant-cache.js";
import { AIGateway } from "../gateway/ai-gateway.js";

const app = express();
app.disable("x-powered-by");
app.use(express.json({ limit: "32kb" }));

const tenantRegistry = new TenantRegistry();
const tenantResolver = new TenantResolver(tenantRegistry);
const tenantPolicy = new TenantPolicy();
const apiKeyService = new ApiKeyService([
  {
    key: config.apiKeys.acme,
    tenantId: "tenant-acme",
    userId: "user-001",
    role: "tenant_admin"
  },
  {
    key: config.apiKeys.beta,
    tenantId: "tenant-beta",
    userId: "user-002",
    role: "member"
  },
  {
    key: config.apiKeys.enterprise,
    tenantId: "tenant-enterprise",
    userId: "user-003",
    role: "tenant_admin"
  }
]);
const userRegistry = new UserRegistry();
const modelPolicy = new ModelPolicy();
const rateLimiter = new TenantRateLimiter();
const budgetManager = new BudgetManager();
const usageMeter = new UsageMeter();
const costTracker = new CostTracker();
const tenantCache = new TenantCache();

const documents = [
  {
    id: "doc-1",
    tenantId: "tenant-acme",
    text: "Acme has 500 employees and its HR policy requires manager approval."
  },
  {
    id: "doc-2",
    tenantId: "tenant-beta",
    text: "Beta Labs has 80 employees and its sales team uses quarterly targets."
  },
  {
    id: "doc-3",
    tenantId: "tenant-enterprise",
    text: "Enterprise Inc has 5000 employees and uses a global security policy."
  }
];

const tenantRAG = new TenantRAG(documents);

const groqClient = new Groq({
  apiKey: config.groqApiKey
});

const aiGateway = new AIGateway({
  tenantResolver,
  tenantPolicy,
  modelPolicy,
  rateLimiter,
  budgetManager,
  usageMeter,
  costTracker,
  groqClient,
  defaultModel: config.groqModel
});

const authenticate = createAuthenticationMiddleware(apiKeyService);

function requireTenantAdmin(req, res, next) {
  if (req.identity?.role !== "tenant_admin") {
    return res.status(403).json({
      error: "Tenant admin role required"
    });
  }

  next();
}

function asyncHandler(handler) {
  return (req, res, next) =>
    Promise.resolve(handler(req, res, next)).catch(next);
}

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "day113-multitenant-genai-saas",
    model: config.groqModel
  });
});

app.get("/api/v1/me", authenticate, (req, res) => {
  const tenant = tenantResolver.resolve(req.identity.tenantId);
  const user = userRegistry.get(req.identity.userId);
  const policy = tenantPolicy.get(tenant.plan);

  res.json({
    user,
    tenant,
    policy
  });
});

app.post(
  "/api/v1/ai/generate",
  authenticate,
  asyncHandler(async (req, res) => {
    const { prompt, model = "fast" } = req.body;

    const result = await aiGateway.generate({
      tenantId: req.identity.tenantId,
      userId: req.identity.userId,
      model,
      prompt
    });

    res.json(result);
  })
);

app.get("/api/v1/rag/search", authenticate, (req, res) => {
  const query = String(req.query.q ?? "").trim();

  if (!query) {
    return res.status(400).json({
      error: "Query parameter q is required"
    });
  }

  const results = tenantRAG.search(
    req.identity.tenantId,
    query
  );

  res.json({
    tenantId: req.identity.tenantId,
    count: results.length,
    results
  });
});

app.post("/api/v1/cache/demo", authenticate, (req, res) => {
  const { prompt, model = "fast", response } = req.body;

  if (!prompt || !response) {
    return res.status(400).json({
      error: "prompt and response are required"
    });
  }

  const context = {
    tenantId: req.identity.tenantId,
    model,
    prompt,
    knowledgeVersion: "v1"
  };

  tenantCache.set(context, response);

  res.status(201).json({
    cached: true,
    tenantId: req.identity.tenantId
  });
});

app.get("/api/v1/cache/demo", authenticate, (req, res) => {
  const prompt = String(req.query.prompt ?? "");
  const model = String(req.query.model ?? "fast");

  if (!prompt) {
    return res.status(400).json({
      error: "prompt is required"
    });
  }

  const value = tenantCache.get({
    tenantId: req.identity.tenantId,
    model,
    prompt,
    knowledgeVersion: "v1"
  });

  res.json({
    hit: value !== undefined,
    value: value ?? null
  });
});

app.get(
  "/api/v1/tenant/usage",
  authenticate,
  (req, res) => {
    const tenant = tenantResolver.resolve(req.identity.tenantId);
    const policy = tenantPolicy.get(tenant.plan);
    const summary = usageMeter.summarizeTenant(tenant.id);
    const cost = costTracker.getTenantCost(
      usageMeter.getTenantUsage(tenant.id)
    );

    res.json({
      tenant: tenant.id,
      plan: tenant.plan,
      usage: summary,
      monthlyTokenLimit: policy.monthlyTokens,
      remainingTokens: budgetManager.getRemaining(
        tenant.id,
        policy.monthlyTokens
      ),
      estimatedCostUsd: cost
    });
  }
);

app.get(
  "/api/v1/tenant/api-keys",
  authenticate,
  requireTenantAdmin,
  (req, res) => {
    res.json({
      tenantId: req.identity.tenantId,
      keys: apiKeyService.listForTenant(req.identity.tenantId)
    });
  }
);

app.get(
  "/api/v1/admin/tenants",
  authenticate,
  requireTenantAdmin,
  (req, res) => {
    const tenants = tenantRegistry.list().map((tenant) => {
      const usage = usageMeter.summarizeTenant(tenant.id);
      const cost = costTracker.getTenantCost(
        usageMeter.getTenantUsage(tenant.id)
      );

      return {
        tenant: tenant.id,
        name: tenant.name,
        plan: tenant.plan,
        requests: usage.requests,
        tokens: usage.totalTokens,
        estimatedCost: cost
      };
    });

    res.json({ tenants });
  }
);

app.use((req, res) => {
  res.status(404).json({
    error: "Route not found"
  });
});

app.use((error, req, res, next) => {
  console.error({
    method: req.method,
    path: req.path,
    tenantId: req.identity?.tenantId,
    error: error.message
  });

  const status = /rate limit|budget exceeded|not allowed|too long/i.test(
    error.message
  )
    ? 429
    : 500;

  res.status(status).json({
    error: error.message
  });
});

const server = app.listen(config.port, () => {
  console.log(
    `Day 113 API running on http://localhost:${config.port}`
  );
});

function shutdown(signal) {
  console.log(`${signal} received. Shutting down...`);

  server.close(() => {
    process.exit(0);
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));