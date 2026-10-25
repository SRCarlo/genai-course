const test = require("node:test");
const assert = require("node:assert/strict");

const { summarizeUsage } = require("../src/analytics/usage-analytics");

const { evaluateBudgetAlerts } = require("../src/analytics/budget-alerts");

const events = [
  {
    eventId: "evt-1",
    tenantId: "tenant-a",
    model: "model-fast",
    status: "SUCCEEDED",
    inputTokens: 1000,
    outputTokens: 200,
    providerCost: 0.01,
    cacheStatus: "MISS",
    timestamp: "2026-10-25T08:00:00.000Z",
  },
  {
    eventId: "evt-2",
    tenantId: "tenant-a",
    model: "model-fast",
    status: "SUCCEEDED",
    inputTokens: 500,
    outputTokens: 100,
    providerCost: 0,
    cacheStatus: "HIT",
    timestamp: "2026-10-25T08:10:00.000Z",
  },
  {
    eventId: "evt-3",
    tenantId: "tenant-b",
    model: "model-quality",
    status: "FAILED",
    inputTokens: 2000,
    outputTokens: 0,
    providerCost: 0.02,
    cacheStatus: "MISS",
    timestamp: "2026-10-25T08:20:00.000Z",
  },
];

test("aggregates total tokens and provider cost", () => {
  const report = summarizeUsage(events);

  assert.equal(report.eventCount, 3);
  assert.equal(report.inputTokens, 3500);
  assert.equal(report.outputTokens, 300);
  assert.ok(Math.abs(report.providerCost - 0.03) < 1e-12);
});

test("calculates success rate and cache hit rate", () => {
  const report = summarizeUsage(events);

  assert.ok(Math.abs(report.successRate - 2 / 3) < 1e-12);
  assert.equal(report.cacheHitRate, 1 / 3);
});

test("isolates a tenant's analytics", () => {
  const report = summarizeUsage(events, {
    tenantId: "tenant-a",
  });

  assert.equal(report.eventCount, 2);
  assert.equal(report.inputTokens, 1500);
  assert.ok(Math.abs(report.providerCost - 0.01) < 1e-12);
  assert.deepEqual(Object.keys(report.byTenant), ["tenant-a"]);
});

test("rejects duplicate event IDs", () => {
  assert.throws(
    () => summarizeUsage([events[0], events[0]]),
    /Duplicate eventId/,
  );
});

test("returns no alerts below all thresholds", () => {
  assert.deepEqual(
    evaluateBudgetAlerts({
      tenantId: "tenant-a",
      spent: 50,
      budget: 100,
    }),
    [],
  );
});

test("raises a warning at 85 percent budget usage", () => {
  const alerts = evaluateBudgetAlerts({
    tenantId: "tenant-a",
    spent: 85,
    budget: 100,
  });

  assert.equal(alerts.length, 1);
  assert.equal(alerts[0].severity, "WARNING");
  assert.equal(alerts[0].threshold, 0.8);
});

test("raises warning and critical alerts when over budget", () => {
  const alerts = evaluateBudgetAlerts({
    tenantId: "tenant-a",
    spent: 120,
    budget: 100,
  });

  assert.equal(alerts.length, 2);
  assert.equal(alerts[1].severity, "CRITICAL");
});

test("rejects a zero budget", () => {
  assert.throws(
    () =>
      evaluateBudgetAlerts({
        tenantId: "tenant-a",
        spent: 1,
        budget: 0,
      }),
    /greater than zero/,
  );
});
