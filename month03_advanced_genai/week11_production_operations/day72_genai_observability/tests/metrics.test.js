import test from "node:test";

import assert from "node:assert/strict";

import {
  recordRequest,
  recordAIUsage,
  recordRagUsage,
  recordAgentRun,
  recordAgentIteration,
  recordToolCall,
  getMetrics,
  resetMetrics,
} from "../src/services/metrics.service.js";

test.beforeEach(() => {
  resetMetrics();
});

test("records request metrics", () => {
  recordRequest({
    latencyMs: 100,
    success: true,
  });

  recordRequest({
    latencyMs: 200,
    success: false,
  });

  const metrics = getMetrics();

  assert.equal(metrics.requests.total, 2);

  assert.equal(metrics.requests.successful, 1);

  assert.equal(metrics.requests.failed, 1);

  assert.equal(metrics.requests.errorRatePercent, 50);
});

test("records AI token and cost metrics", () => {
  recordAIUsage({
    model: "openai/gpt-oss-20b",

    tenantId: "tenant-test",

    inputTokens: 1000,

    outputTokens: 500,

    costUsd: 0.000225,

    latencyMs: 800,

    success: true,
  });

  const metrics = getMetrics();

  assert.equal(metrics.ai.tokens.input, 1000);

  assert.equal(metrics.ai.tokens.output, 500);

  assert.equal(metrics.ai.tokens.total, 1500);

  assert.equal(metrics.ai.costUsd, 0.000225);

  assert.equal(metrics.models["openai/gpt-oss-20b"].requests, 1);

  assert.equal(metrics.tenants["tenant-test"].requests, 1);
});

test("records RAG metrics", () => {
  recordRagUsage({
    latencyMs: 250,
    documentsRetrieved: 8,
    success: true,
  });

  const metrics = getMetrics();

  assert.equal(metrics.rag.requests, 1);

  assert.equal(metrics.rag.documentsRetrieved, 8);
});

test("records agent metrics", () => {
  recordAgentRun();

  recordAgentIteration();

  recordAgentIteration();

  recordToolCall({
    success: true,
  });

  recordToolCall({
    success: false,
  });

  const metrics = getMetrics();

  assert.equal(metrics.agents.runs, 1);

  assert.equal(metrics.agents.iterations, 2);

  assert.equal(metrics.agents.toolCalls, 2);

  assert.equal(metrics.agents.toolFailures, 1);
});
