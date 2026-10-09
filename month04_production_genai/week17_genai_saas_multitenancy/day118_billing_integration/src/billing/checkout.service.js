import { createHash } from "node:crypto";
import { MockPaymentProvider } from "./payment-provider.js";

const PLANS = Object.freeze({
  free: Object.freeze({ providerPriceId: null, monthlyPriceMinor: 0, currency: "USD" }),
  starter: Object.freeze({ providerPriceId: "price_starter_test", monthlyPriceMinor: 1900, currency: "USD" }),
  pro: Object.freeze({ providerPriceId: "price_pro_test", monthlyPriceMinor: 4900, currency: "USD" })
});

export class CheckoutService {
  constructor({ provider = new MockPaymentProvider() } = {}) {
    this.provider = provider;
    this.sessions = new Map();
  }

  async createCheckout({ tenantId, planId, idempotencyKey }) {
    if (![tenantId, planId, idempotencyKey].every(
      (value) => typeof value === "string" && value.trim().length > 0
    )) {
      throw new Error("INVALID_CHECKOUT_REQUEST");
    }

    const plan = PLANS[planId];
    if (!plan || planId === "free") {
      throw new Error("PAID_PLAN_REQUIRED");
    }

    if (idempotencyKey.length > 200) {
      throw new Error("IDEMPOTENCY_KEY_TOO_LONG");
    }

    const scopedKey = `${tenantId}:${idempotencyKey}`;
    const requestFingerprint = createHash("sha256")
      .update(JSON.stringify({ tenantId, planId }))
      .digest("hex");

    const existing = this.sessions.get(scopedKey);
    if (existing) {
      if (existing.requestFingerprint !== requestFingerprint) {
        throw new Error("IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST");
      }
      return existing.session;
    }

    const session = await this.provider.createCheckoutSession({
      tenantId,
      planId,
      providerPriceId: plan.providerPriceId,
      idempotencyKey: scopedKey
    });

    this.sessions.set(scopedKey, { requestFingerprint, session });
    return session;
  }
}

export { PLANS };
