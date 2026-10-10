import "dotenv/config";
import express from "express";
import { InMemorySubscriptionRepository } from "./subscriptions/subscription.repository.js";
import { TenantAccessService } from "./tenancy/tenant-access.service.js";
import { EntitlementService } from "./entitlements/entitlement.service.js";
import { InMemoryUsageService } from "./usage/usage.service.js";
import { requireEntitlement } from "./middleware/require-entitlement.js";
import { GroqChatAdapter } from "./ai/groq.adapter.js";
import { ChatService } from "./ai/chat.service.js";

export function createApp({
  llm = new GroqChatAdapter(),
  subscriptions = new InMemorySubscriptionRepository(),
  tenantAccess = new TenantAccessService([
    { userId: "user_001", tenantId: "tenant_acme", role: "admin", status: "active" },
    { userId: "user_002", tenantId: "tenant_beta", role: "member", status: "active" }
  ]),
  usageService = new InMemoryUsageService()
} = {}) {
  const app = express();
  app.disable("x-powered-by");
  app.use(express.json({ limit: "32kb" }));
  app.get("/health", (_req, res) => res.json({ status: "ok" }));

  // Optional local-only fixture. Never enable demo seeding in production.
  if (process.env.NODE_ENV === "development" && process.env.SEED_DEMO_DATA === "true") {
    void subscriptions.save({
      tenantId: "tenant_acme",
      planId: "pro",
      status: "active",
      currentPeriodEnd: "2099-01-01T00:00:00.000Z",
      cancelAtPeriodEnd: false
    });
  }

  const entitlements = new EntitlementService(subscriptions);
  const chatService = new ChatService({ entitlementService: entitlements, usageService, llm });

  // LOCAL LEARNING ONLY. Replace these spoofable headers with verified session/JWT auth.
  app.use(async (req, res, next) => {
    const userId = req.get("x-demo-user-id") || "";
    const tenantId = req.get("x-demo-tenant-id") || "";

    if (!userId || !tenantId) {
      return res.status(401).json({ error: "AUTHENTICATION_REQUIRED" });
    }

    try {
      const allowed = await tenantAccess.canAccessTenant({ userId, tenantId });
      if (!allowed) {
        return res.status(403).json({ error: "TENANT_ACCESS_DENIED" });
      }
      req.auth = { userId, tenantId };
      return next();
    } catch (error) {
      return next(error);
    }
  });

  app.get("/api/entitlements", async (req, res, next) => {
    try {
      const result = await entitlements.getEntitlements(req.auth.tenantId);
      return res.json(result);
    } catch (error) {
      if (error.message === "SUBSCRIPTION_NOT_FOUND") {
        return res.status(404).json({ error: error.message });
      }
      return next(error);
    }
  });

  app.get(
    "/api/advanced-rag",
    requireEntitlement(entitlements, "advancedRag"),
    (_req, res) => res.json({ message: "Advanced RAG entitlement granted" })
  );

  app.post("/api/chat", async (req, res, next) => {
    try {
      const { question } = req.body ?? {};
      if (typeof question !== "string" || !question.trim()) {
        return res.status(400).json({ error: "QUESTION_REQUIRED" });
      }

      const result = await chatService.chat({
        tenantId: req.auth.tenantId,
        question
      });
      return res.json(result);
    } catch (error) {
      const clientErrors = new Set([
        "SUBSCRIPTION_NOT_FOUND",
        "SUBSCRIPTION_ACCESS_DENIED",
        "FEATURE_NOT_ENTITLED",
        "UNKNOWN_FEATURE",
        "REQUEST_QUOTA_EXCEEDED",
        "TOKEN_QUOTA_EXCEEDED",
        "QUESTION_REQUIRED",
        "QUESTION_TOO_LONG"
      ]);
      if (clientErrors.has(error.message)) {
        const status = ["REQUEST_QUOTA_EXCEEDED", "TOKEN_QUOTA_EXCEEDED"].includes(error.message) ? 429 : 403;
        return res.status(status).json({ error: error.message });
      }
      if (error.message === "GROQ_API_KEY_MISSING") {
        return res.status(503).json({ error: "AI_PROVIDER_NOT_CONFIGURED" });
      }
      return next(error);
    }
  });

  app.use((error, _req, res, _next) => {
    // Do not send provider internals, stack traces, or secrets to clients.
    if (process.env.NODE_ENV !== "test") {
      console.error("Request failed:", error.message);
    }
    return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
  });

  return { app, subscriptions, usageService, entitlements };
}

const runtime = createApp();
export const app = runtime.app;
export const subscriptions = runtime.subscriptions;
export const usageService = runtime.usageService;

if (process.env.NODE_ENV !== "test") {
  const port = Number(process.env.PORT || 3000);
  app.listen(port, () => {
    console.log(`Day 119 API listening on port ${port}`);
  });
}
