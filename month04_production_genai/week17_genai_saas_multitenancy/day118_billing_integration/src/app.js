import express from "express";
import { config } from "./config/config.js";
import { CheckoutService } from "./billing/checkout.service.js";
import { InMemoryEventStore } from "./billing/event-store.js";
import { WebhookService } from "./billing/webhook.service.js";
import { createWebhookRouter } from "./webhooks/webhook.routes.js";
import { GroqService } from "./ai/groq.service.js";

const app = express();
const checkoutService = new CheckoutService();
const eventStore = new InMemoryEventStore();
const webhookService = new WebhookService(eventStore);

// IMPORTANT: webhook raw-body parser must run before express.json().
app.use(
  "/webhooks",
  express.raw({ type: "application/json", limit: "256kb" }),
  createWebhookRouter({
    webhookService,
    webhookSecret: config.webhookSecret
  })
);

app.use(express.json({ limit: "32kb" }));

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/billing/checkout", async (req, res, next) => {
  try {
    const { planId, idempotencyKey } = req.body ?? {};
    if (typeof planId !== "string" || typeof idempotencyKey !== "string") {
      return res.status(400).json({ error: "INVALID_CHECKOUT_REQUEST" });
    }

    // Demo only. Replace this with authenticated tenant identity from trusted middleware.
    const tenantId = "tenant_demo";
    const session = await checkoutService.createCheckout({ tenantId, planId, idempotencyKey });

    return res.status(201).json({
      sessionId: session.id,
      checkoutUrl: session.checkoutUrl,
      status: session.status
    });
  } catch (error) {
    if ([
      "INVALID_CHECKOUT_REQUEST",
      "PAID_PLAN_REQUIRED",
      "IDEMPOTENCY_KEY_TOO_LONG",
      "IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST"
    ].includes(error.message)) {
      return res.status(400).json({ error: error.message });
    }
    return next(error);
  }
});

if (config.groqApiKey) {
  const groqService = new GroqService({
    apiKey: config.groqApiKey,
    model: config.groqModel
  });

  app.post("/api/ai/billing-help", async (req, res, next) => {
    try {
      const { question } = req.body ?? {};
      if (typeof question !== "string" || !question.trim() || question.length > 2000) {
        return res.status(400).json({ error: "QUESTION_MUST_BE_1_TO_2000_CHARACTERS" });
      }

      const answer = await groqService.answerBillingQuestion(question);
      return res.json({ model: config.groqModel, answer });
    } catch (error) {
      return next(error);
    }
  });
}

app.use((error, _req, res, _next) => {
  // Avoid returning internal exception details to clients.
  console.error("Request failed:", error.message);
  res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
});

app.listen(config.port, () => {
  console.log(`Day 118 billing demo listening on http://localhost:${config.port}`);
});
