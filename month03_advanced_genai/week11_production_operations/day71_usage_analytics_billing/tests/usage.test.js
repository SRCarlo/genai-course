import test from "node:test";
import assert from "node:assert/strict";

import { createUsageEvent } from "../src/services/usage.service.js";

test("creates usage event", () => {
  const event = createUsageEvent({
    requestId: "req_test",
    userId: "user_1",
    tenantId: "tenant_1",
    model: "openai/gpt-oss-20b",
    endpoint: "/api/ai/chat",
    inputTokens: 1000,
    outputTokens: 500,
    latencyMs: 1000,
    status: "success",
  });

  assert.equal(event.requestId, "req_test");

  assert.equal(event.totalTokens, 1500);

  assert.equal(event.status, "success");

  assert.ok(event.cost > 0);
});
