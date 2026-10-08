import test from "node:test";
import assert from "node:assert/strict";

import {
  createWebhookSignature,
  verifyWebhookSignature
} from "../src/webhooks/webhook.signature.js";
import { IdempotencyStore } from "../src/infrastructure/idempotency-store.js";
import { handleWebhook } from "../src/webhooks/webhook.handler.js";

test("verifies a webhook signature", () => {
  const payload = JSON.stringify({
    id: "evt_1",
    type: "invoice.paid"
  });

  const secret = "test-secret";
  const signature = createWebhookSignature(payload, secret);

  assert.equal(verifyWebhookSignature(payload, signature, secret), true);
  assert.equal(verifyWebhookSignature(payload, "bad", secret), false);
});

test("processes a webhook only once", async () => {
  const store = new IdempotencyStore();
  let processed = 0;

  const billingService = {
    processEvent: async () => {
      processed += 1;
    }
  };

  const event = {
    id: "evt_123",
    type: "invoice.paid",
    data: {}
  };

  const first = await handleWebhook(event, {
    idempotencyStore: store,
    billingService
  });

  const second = await handleWebhook(event, {
    idempotencyStore: store,
    billingService
  });

  assert.equal(first.duplicate, false);
  assert.equal(second.duplicate, true);
  assert.equal(processed, 1);
});
