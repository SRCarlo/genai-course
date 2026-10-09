import { describe, expect, it } from "vitest";
import { CheckoutService } from "../src/billing/checkout.service.js";

describe("checkout service", () => {
  it("uses a server-side price and returns the same session for a retry", async () => {
    const service = new CheckoutService();
    const input = { tenantId: "tenant_1", planId: "pro", idempotencyKey: "request-1" };

    const first = await service.createCheckout(input);
    const second = await service.createCheckout(input);

    expect(first).toEqual(second);
    expect(first.providerPriceId).toBe("price_pro_test");
  });

  it("rejects free plan checkout", async () => {
    const service = new CheckoutService();
    await expect(service.createCheckout({
      tenantId: "tenant_1", planId: "free", idempotencyKey: "request-2"
    })).rejects.toThrow("PAID_PLAN_REQUIRED");
  });

  it("rejects reusing an idempotency key with a different plan", async () => {
    const service = new CheckoutService();
    await service.createCheckout({
      tenantId: "tenant_1", planId: "pro", idempotencyKey: "same-key"
    });
    await expect(service.createCheckout({
      tenantId: "tenant_1", planId: "starter", idempotencyKey: "same-key"
    })).rejects.toThrow("IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST");
  });
});
