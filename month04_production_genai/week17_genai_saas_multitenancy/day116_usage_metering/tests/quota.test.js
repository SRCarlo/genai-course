import test from "node:test";
import assert from "node:assert/strict";
import { UsageStore } from "../src/usage/usage-store.js";
import { UsageMeter } from "../src/usage/usage-meter.js";
import { UsageService } from "../src/usage/usage-service.js";
import { QuotaService } from "../src/quotas/quota-service.js";

function createQuotaService() {
  const store = new UsageStore();
  const meter = new UsageMeter(store);
  const service = new UsageService(store);
  const quota = new QuotaService(service);

  return { meter, quota };
}

function addRecord(meter, requestId, inputTokens, outputTokens) {
  meter.record({
    requestId,
    tenantId: "tenant-a",
    userId: "user-a",
    apiKeyId: "key-a",
    model: "openai/gpt-oss-20b",
    inputTokens,
    outputTokens,
    latencyMs: 10,
    cost: {
      inputCost: 0,
      outputCost: 0,
      totalCost: 0,
      currency: "USD"
    }
  });
}

test("below quota is allowed", () => {
  const { meter, quota } = createQuotaService();

  addRecord(meter, "req-1", 100, 100);

  const result = quota.checkMonthly("tenant-a", "free");

  assert.equal(result.tokens.allowed, true);
  assert.equal(result.requests.allowed, true);
});

test("projected usage can reject a request", () => {
  const { meter, quota } = createQuotaService();

  addRecord(meter, "req-1", 99_000, 0);

  const result = quota.checkProjected({
    tenantId: "tenant-a",
    planName: "free",
    estimatedTokens: 2_000
  });

  assert.equal(result.allowed, false);
});
