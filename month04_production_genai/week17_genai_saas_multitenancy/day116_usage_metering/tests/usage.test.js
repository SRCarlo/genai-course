import test from "node:test";
import assert from "node:assert/strict";
import { UsageStore } from "../src/usage/usage-store.js";
import { UsageMeter } from "../src/usage/usage-meter.js";
import { UsageService } from "../src/usage/usage-service.js";

function createServices() {
  const store = new UsageStore();
  const meter = new UsageMeter(store);
  const service = new UsageService(store);
  return { store, meter, service };
}

test("request is recorded and total tokens are calculated", () => {
  const { meter } = createServices();

  const record = meter.record({
    requestId: "req_1",
    tenantId: "tenant-a",
    userId: "user-a",
    apiKeyId: "key-a",
    model: "openai/gpt-oss-20b",
    inputTokens: 100,
    outputTokens: 50,
    latencyMs: 20,
    cost: {
      inputCost: 0.0000075,
      outputCost: 0.000015,
      totalCost: 0.0000225,
      currency: "USD"
    }
  });

  assert.equal(record.totalTokens, 150);
});

test("tenant and user aggregation works", () => {
  const { meter, service } = createServices();

  const common = {
    tenantId: "tenant-a",
    apiKeyId: "key-a",
    model: "openai/gpt-oss-20b",
    latencyMs: 10,
    cost: {
      inputCost: 0,
      outputCost: 0,
      totalCost: 0,
      currency: "USD"
    }
  };

  meter.record({
    ...common,
    requestId: "req_1",
    userId: "user-a",
    inputTokens: 100,
    outputTokens: 50
  });

  meter.record({
    ...common,
    requestId: "req_2",
    userId: "user-b",
    inputTokens: 200,
    outputTokens: 100
  });

  assert.equal(service.getTenantUsage("tenant-a").requests, 2);
  assert.equal(service.getTenantUsage("tenant-a").totalTokens, 450);
  assert.equal(service.getUserUsage("user-a").totalTokens, 150);
});
