import test from "node:test";
import assert from "node:assert/strict";

import { aggregateUsage } from "../src/utils/aggregation.js";

test("aggregates usage", () => {
  const events = [
    {
      inputTokens: 100,
      outputTokens: 50,
      totalTokens: 150,
      cost: 0.01,
      latencyMs: 500,
      status: "success",
    },

    {
      inputTokens: 200,
      outputTokens: 100,
      totalTokens: 300,
      cost: 0.02,
      latencyMs: 700,
      status: "success",
    },
  ];

  const result = aggregateUsage(events);

  assert.equal(result.requests, 2);

  assert.equal(result.totalTokens, 450);

  assert.equal(result.successfulRequests, 2);

  assert.equal(result.cost, 0.03);
});
