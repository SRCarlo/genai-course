import "dotenv/config";
import express from "express";
import crypto from "node:crypto";

import { PLANS, getPlanOrThrow } from "../plans/plans.js";
import { EntitlementService } from "../plans/entitlement.service.js";
import { CustomerService } from "../customers/customer.service.js";
import { SubscriptionService } from "../billing/subscription.service.js";
import { UsageRepository } from "../usage/usage.repository.js";
import { UsageBillingService } from "../billing/usage-billing.service.js";
import { InvoiceService } from "../billing/invoice.service.js";
import { PaymentService } from "../billing/payment.service.js";
import { BillingService } from "../billing/billing.service.js";
import { IdempotencyStore } from "../infrastructure/idempotency-store.js";
import {
  verifyWebhookSignature
} from "../webhooks/webhook.signature.js";
import { handleWebhook } from "../webhooks/webhook.handler.js";
import { validateWebhookEvent } from "../webhooks/webhook-events.js";

const app = express();
const port = Number(process.env.PORT || 3000);
const webhookSecret = process.env.WEBHOOK_SECRET || "development-secret";

const customerService = new CustomerService();
const subscriptionService = new SubscriptionService();
const entitlementService = new EntitlementService();
const usageRepository = new UsageRepository();
const usageBillingService = new UsageBillingService();
const invoiceService = new InvoiceService();
const paymentService = new PaymentService();
const idempotencyStore = new IdempotencyStore();

const billingService = new BillingService({
  customerService,
  subscriptionService,
  entitlementService,
  usageRepository,
  usageBillingService,
  invoiceService,
  paymentService
});

app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    service: "day117-saas-billing"
  });
});

app.get("/v1/plans", (_req, res) => {
  res.json({ plans: Object.values(PLANS) });
});

app.get("/v1/billing/subscription/:tenantId", (req, res) => {
  const subscription = subscriptionService.getSubscription(req.params.tenantId);

  if (!subscription) {
    return res.status(404).json({ error: "SUBSCRIPTION_NOT_FOUND" });
  }

  return res.json({
    subscription,
    entitlements: entitlementService.getEntitlements(subscription.planId)
  });
});

app.post("/v1/billing/customer", express.json(), (req, res, next) => {
  try {
    const customer = customerService.create(req.body);
    return res.status(201).json({ customer });
  } catch (error) {
    return next(error);
  }
});

app.post("/v1/billing/subscription", express.json(), (req, res, next) => {
  try {
    const subscription = subscriptionService.createSubscription(req.body);
    return res.status(201).json({ subscription });
  } catch (error) {
    return next(error);
  }
});

app.post(
  "/v1/billing/subscription/upgrade",
  express.json(),
  (req, res, next) => {
    try {
      const result = subscriptionService.upgradeSubscription(
        req.body.tenantId,
        req.body.planId
      );
      return res.json(result);
    } catch (error) {
      return next(error);
    }
  }
);

app.post(
  "/v1/billing/subscription/downgrade",
  express.json(),
  (req, res, next) => {
    try {
      const subscription = subscriptionService.downgradeSubscription(
        req.body.tenantId,
        req.body.planId
      );
      return res.json({ subscription });
    } catch (error) {
      return next(error);
    }
  }
);

app.post(
  "/v1/billing/subscription/cancel",
  express.json(),
  (req, res, next) => {
    try {
      const subscription = subscriptionService.cancelSubscription(
        req.body.tenantId,
        { immediately: req.body.immediately === true }
      );
      return res.json({ subscription });
    } catch (error) {
      return next(error);
    }
  }
);

app.post("/v1/usage", express.json(), (req, res, next) => {
  try {
    const usage = usageRepository.record(req.body);
    return res.status(201).json({ usage });
  } catch (error) {
    return next(error);
  }
});

app.get("/v1/billing/usage", (req, res, next) => {
  try {
    const subscription = subscriptionService.getSubscription(req.query.tenantId);

    if (!subscription) {
      return res.status(404).json({ error: "SUBSCRIPTION_NOT_FOUND" });
    }

    const usage = usageRepository.aggregate(
      req.query.tenantId,
      subscription.currentPeriodStart,
      subscription.currentPeriodEnd
    );

    return res.json({ usage });
  } catch (error) {
    return next(error);
  }
});

app.post("/v1/billing/invoice", express.json(), async (req, res, next) => {
  try {
    const result = await billingService.generateInvoiceForTenant(
      req.body.tenantId
    );
    return res.status(201).json(result);
  } catch (error) {
    return next(error);
  }
});

app.get("/v1/billing/invoices", (req, res, next) => {
  try {
    const invoices = invoiceService.listByTenant(req.query.tenantId);
    return res.json({ invoices });
  } catch (error) {
    return next(error);
  }
});

app.get("/v1/billing/invoices/:id", (req, res, next) => {
  try {
    const invoice = invoiceService.getById(req.params.id);
    return res.json({ invoice });
  } catch (error) {
    return next(error);
  }
});

app.post("/v1/billing/invoices/:id/pay", async (req, res, next) => {
  try {
    const invoice = await billingService.payInvoice(
      req.body.tenantId,
      req.params.id
    );
    return res.json({ invoice });
  } catch (error) {
    return next(error);
  }
});

app.post(
  "/v1/webhooks/billing",
  express.raw({ type: "application/json" }),
  async (req, res, next) => {
    try {
      const rawBody = req.body.toString("utf8");
      const signature = req.header("x-webhook-signature");

      if (!verifyWebhookSignature(rawBody, signature, webhookSecret)) {
        return res.status(401).json({ error: "INVALID_WEBHOOK_SIGNATURE" });
      }

      const event = JSON.parse(rawBody);

      if (!validateWebhookEvent(event)) {
        return res.status(400).json({ error: "INVALID_WEBHOOK_EVENT" });
      }

      const result = await handleWebhook(event, {
        idempotencyStore,
        billingService
      });

      return res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  }
);

// Learning/demo endpoint for the Day 117 advanced assignment.
app.post("/v1/demo/billing", express.json(), async (req, res, next) => {
  try {
    const {
      tenantId,
      email,
      name,
      planId = "pro",
      inputTokens = 8_000_000,
      outputTokens = 5_000_000
    } = req.body;

    getPlanOrThrow(planId);

    customerService.create({ tenantId, email, name });

    const existing = subscriptionService.getSubscription(tenantId);
    const subscription =
      existing ??
      subscriptionService.createSubscription({
        tenantId,
        planId,
        periodStart: new Date()
      });

    if (subscription.planId !== planId) {
      subscriptionService.upgradeSubscription(tenantId, planId);
    }

    usageRepository.record({
      tenantId,
      inputTokens,
      outputTokens,
      requests: 1
    });

    const { invoice, usage, billing } =
      await billingService.generateInvoiceForTenant(tenantId);

    await billingService.payInvoice(tenantId, invoice.id);

    const finalInvoice = invoiceService.getById(invoice.id);

    return res.status(201).json({
      tenantId,
      subscription: subscriptionService.getSubscription(tenantId),
      usage,
      billing,
      invoice: finalInvoice
    });
  } catch (error) {
    return next(error);
  }
});

app.use((error, _req, res, _next) => {
  const statusByError = {
    PLAN_NOT_FOUND: 404,
    SUBSCRIPTION_NOT_FOUND: 404,
    INVOICE_NOT_FOUND: 404,
    CUSTOMER_NOT_FOUND: 404,
    PAYMENT_NOT_FOUND: 404,
    INVOICE_ACCESS_DENIED: 403,
    INVALID_WEBHOOK_EVENT: 400,
    INVALID_PAYMENT_AMOUNT: 400
  };

  const status = statusByError[error.message] || 400;

  if (process.env.NODE_ENV !== "test") {
    console.error(`[billing-error] ${error.message}`);
  }

  res.status(status).json({
    error: error.message || "INTERNAL_ERROR"
  });
});

const server = app.listen(port, () => {
  console.log(`Day 117 billing API running on http://localhost:${port}`);
});

function shutdown(signal) {
  console.log(`${signal} received. Shutting down...`);
  server.close(() => process.exit(0));
}

process.once("SIGINT", () => shutdown("SIGINT"));
process.once("SIGTERM", () => shutdown("SIGTERM"));

export { app, server };
