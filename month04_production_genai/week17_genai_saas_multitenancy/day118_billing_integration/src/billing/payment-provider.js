export class MockPaymentProvider {
  #sessions = new Map();

  async createCheckoutSession({ tenantId, planId, providerPriceId, idempotencyKey }) {
    if (![tenantId, planId, providerPriceId, idempotencyKey].every(
      (value) => typeof value === "string" && value.trim().length > 0
    )) {
      throw new Error("INVALID_CHECKOUT_INPUT");
    }

    if (this.#sessions.has(idempotencyKey)) {
      return this.#sessions.get(idempotencyKey);
    }

    const session = Object.freeze({
      id: `cs_${idempotencyKey}`,
      tenantId,
      planId,
      providerPriceId,
      status: "created",
      checkoutUrl: `https://checkout.example.test/${encodeURIComponent(idempotencyKey)}`
    });

    this.#sessions.set(idempotencyKey, session);
    return session;
  }
}
