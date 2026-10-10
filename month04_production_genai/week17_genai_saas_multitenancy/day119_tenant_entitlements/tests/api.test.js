import { beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "../src/app.js";
import { InMemorySubscriptionRepository } from "../src/subscriptions/subscription.repository.js";
import { TenantAccessService } from "../src/tenancy/tenant-access.service.js";
import { InMemoryUsageService } from "../src/usage/usage.service.js";

const fakeLlm = {
  async generate({ question }) {
    return {
      answer: `Test response: ${question}`,
      usage: { inputTokens: 10, outputTokens: 8 }
    };
  }
};

describe("Day 119 API", () => {
  let subscriptions;
  let usageService;
  let app;

  beforeEach(async () => {
    subscriptions = new InMemorySubscriptionRepository();
    usageService = new InMemoryUsageService();
    ({ app } = createApp({
      llm: fakeLlm,
      subscriptions,
      usageService,
      tenantAccess: new TenantAccessService([
        { userId: "user_001", tenantId: "tenant_acme", status: "active" },
        { userId: "user_002", tenantId: "tenant_beta", status: "active" }
      ])
    }));
  });

  it("requires identity headers", async () => {
    const response = await request(app).get("/api/entitlements");
    expect(response.status).toBe(401);
  });

  it("rejects a user who is not a member of the requested tenant", async () => {
    const response = await request(app)
      .get("/api/entitlements")
      .set("x-demo-user-id", "user_001")
      .set("x-demo-tenant-id", "tenant_beta");
    expect(response.status).toBe(403);
    expect(response.body.error).toBe("TENANT_ACCESS_DENIED");
  });

  it("returns entitlements for an authorized tenant with a subscription", async () => {
    await subscriptions.save({
      tenantId: "tenant_acme",
      planId: "pro",
      status: "active",
      currentPeriodEnd: "2099-01-01T00:00:00.000Z"
    });
    const response = await request(app)
      .get("/api/entitlements")
      .set("x-demo-user-id", "user_001")
      .set("x-demo-tenant-id", "tenant_acme");
    expect(response.status).toBe(200);
    expect(response.body.features.agents).toBe(true);
  });

  it("allows an entitled tenant to call the mocked chat service", async () => {
    await subscriptions.save({
      tenantId: "tenant_acme",
      planId: "pro",
      status: "active",
      currentPeriodEnd: "2099-01-01T00:00:00.000Z"
    });
    const response = await request(app)
      .post("/api/chat")
      .set("x-demo-user-id", "user_001")
      .set("x-demo-tenant-id", "tenant_acme")
      .send({ question: "Hello" });
    expect(response.status).toBe(200);
    expect(response.body.answer).toBe("Test response: Hello");
    expect(response.body.usage.totalTokens).toBe(18);
  });

  it("does not let a Starter tenant use advanced RAG", async () => {
    await subscriptions.save({
      tenantId: "tenant_beta",
      planId: "starter",
      status: "active",
      currentPeriodEnd: "2099-01-01T00:00:00.000Z"
    });
    const response = await request(app)
      .get("/api/advanced-rag")
      .set("x-demo-user-id", "user_002")
      .set("x-demo-tenant-id", "tenant_beta");
    expect(response.status).toBe(403);
    expect(response.body.error).toBe("FEATURE_NOT_ENTITLED");
  });
});
