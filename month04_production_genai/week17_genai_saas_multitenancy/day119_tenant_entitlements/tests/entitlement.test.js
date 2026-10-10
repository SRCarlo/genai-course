import { describe, expect, it } from "vitest";
import { InMemorySubscriptionRepository } from "../src/subscriptions/subscription.repository.js";
import { EntitlementService } from "../src/entitlements/entitlement.service.js";

describe("EntitlementService", () => {
  it("allows advanced RAG for an active Pro subscription", async () => {
    const repo = new InMemorySubscriptionRepository();
    await repo.save({
      tenantId: "tenant_acme",
      planId: "pro",
      status: "active",
      currentPeriodEnd: "2099-01-01T00:00:00.000Z"
    });
    const service = new EntitlementService(repo);
    const result = await service.requireFeature("tenant_acme", "advancedRag");
    expect(result.accessAllowed).toBe(true);
    expect(result.features.advancedRag).toBe(true);
  });

  it("denies agents for Starter", async () => {
    const repo = new InMemorySubscriptionRepository();
    await repo.save({ tenantId: "tenant_beta", planId: "starter", status: "active" });
    const service = new EntitlementService(repo);
    await expect(service.requireFeature("tenant_beta", "agents"))
      .rejects.toThrow("FEATURE_NOT_ENTITLED");
  });

  it("denies past-due subscriptions", async () => {
    const repo = new InMemorySubscriptionRepository();
    await repo.save({ tenantId: "tenant_acme", planId: "pro", status: "past_due" });
    const service = new EntitlementService(repo);
    await expect(service.requireFeature("tenant_acme", "basicChat"))
      .rejects.toThrow("SUBSCRIPTION_ACCESS_DENIED");
  });

  it("denies expired billing periods", async () => {
    const repo = new InMemorySubscriptionRepository();
    await repo.save({
      tenantId: "tenant_acme",
      planId: "pro",
      status: "active",
      currentPeriodEnd: "2000-01-01T00:00:00.000Z"
    });
    const service = new EntitlementService(repo, { clock: () => Date.parse("2026-01-01T00:00:00Z") });
    await expect(service.requireFeature("tenant_acme", "basicChat"))
      .rejects.toThrow("SUBSCRIPTION_ACCESS_DENIED");
  });
});
