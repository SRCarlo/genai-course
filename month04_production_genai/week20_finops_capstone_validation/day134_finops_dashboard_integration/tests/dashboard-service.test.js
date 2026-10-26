"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const path = require("node:path");

const {
  buildFinOpsDashboard,
} = require("../src/finops/dashboard-service");

const events = JSON.parse(
  readFileSync(
    path.join(__dirname, "../examples/usage-events.json"),
    "utf8"
  )
);

test("aggregates usage for only the requested tenant", () => {
  const result = buildFinOpsDashboard({
    tenantId: "tenant-a",
    events,
    budget: 0.10,
    estimatedAvoidedProviderCost: 0.006,
  });

  assert.equal(result.summary.requests, 3);
  assert.equal(result.summary.succeeded, 3);
  assert.equal(result.summary.inputTokens, 3000);
  assert.equal(result.summary.outputTokens, 500);
  assert.equal(result.summary.providerCost, 0.03);
  assert.equal(result.summary.cacheHits, 1);
  assert.equal(result.summary.cacheMisses, 2);
  assert.equal(result.summary.cacheHitRate, 33.33);

  assert.ok(
    result.byModel.every((item) =>
      ["model-fast", "model-quality"].includes(item.model)
    )
  );
});

test("does not include another tenant's cost", () => {
  const result = buildFinOpsDashboard({
    tenantId: "tenant-a",
    events,
    budget: 0.10,
  });

  assert.equal(result.summary.providerCost, 0.03);
  assert.equal(result.tenantId, "tenant-a");
});

test("returns empty-period metrics without division by zero", () => {
  const result = buildFinOpsDashboard({
    tenantId: "tenant-empty",
    events,
    budget: 1,
  });

  assert.equal(result.summary.requests, 0);
  assert.equal(result.summary.successRate, null);
  assert.equal(result.summary.averageProviderCost, null);
  assert.equal(result.summary.cacheHitRate, null);
});

test("rejects duplicate event IDs in the scoped data", () => {
  const duplicate = {
    ...events[0],
    providerCost: 0,
  };

  assert.throws(
    () =>
      buildFinOpsDashboard({
        tenantId: "tenant-a",
        events: [events[0], duplicate],
        budget: 1,
      }),
    /Duplicate eventId/
  );
});

test("rejects invalid cost data", () => {
  assert.throws(
    () =>
      buildFinOpsDashboard({
        tenantId: "tenant-a",
        events: [
          {
            ...events[0],
            providerCost: -1,
          },
        ],
        budget: 1,
      }),
    /providerCost/
  );
});
