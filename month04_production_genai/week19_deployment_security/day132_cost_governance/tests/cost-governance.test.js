const test = require("node:test");
const assert = require("node:assert/strict");

const { estimateModelCost } = require("../src/billing/cost-estimator");

const { createQuotaService } = require("../src/billing/quota-service");

const { createUsageRecord } = require("../src/billing/usage-record");

test("estimates input and output cost", () => {
  const result = estimateModelCost({
    inputTokens: 2000,
    outputTokens: 500,
    inputPricePerMillion: 2,
    outputPricePerMillion: 8,
  });

  assert.ok(Math.abs(result.totalCost - 0.008) < 1e-12);
});

test("rejects negative token counts", () => {
  assert.throws(
    () =>
      estimateModelCost({
        inputTokens: -1,
        outputTokens: 100,
        inputPricePerMillion: 2,
        outputPricePerMillion: 8,
      }),
    /non-negative/,
  );
});

test("prevents reservations beyond the configured budget", () => {
  const quotas = createQuotaService();
  quotas.configureTenant("tenant-a", 1);

  assert.equal(
    quotas.reserve({
      tenantId: "tenant-a",
      requestId: "req-1",
      estimatedCostDollars: 0.7,
    }).allowed,
    true,
  );

  assert.deepEqual(
    quotas.reserve({
      tenantId: "tenant-a",
      requestId: "req-2",
      estimatedCostDollars: 0.4,
    }),
    {
      allowed: false,
      reason: "BUDGET_EXCEEDED",
    },
  );

  assert.equal(quotas.getBalance("tenant-a").availableDollars, 0.3);
});

test("settlement reconciles a reservation with actual cost", () => {
  const quotas = createQuotaService();
  quotas.configureTenant("tenant-a", 2);

  quotas.reserve({
    tenantId: "tenant-a",
    requestId: "req-1",
    estimatedCostDollars: 0.5,
  });

  quotas.settle({
    requestId: "req-1",
    actualCostDollars: 0.4,
  });

  const balance = quotas.getBalance("tenant-a");

  assert.equal(balance.spentDollars, 0.4);
  assert.equal(balance.reservedDollars, 0);
  assert.ok(Math.abs(balance.availableDollars - 1.6) < 1e-9);
});

test("releases a failed request reservation", () => {
  const quotas = createQuotaService();
  quotas.configureTenant("tenant-a", 2);

  quotas.reserve({
    tenantId: "tenant-a",
    requestId: "req-1",
    estimatedCostDollars: 0.5,
  });

  quotas.release("req-1");

  assert.equal(quotas.getBalance("tenant-a").reservedDollars, 0);
  assert.equal(quotas.getBalance("tenant-a").availableDollars, 2);
});

test("does not allow duplicate reservation IDs", () => {
  const quotas = createQuotaService();
  quotas.configureTenant("tenant-a", 2);

  quotas.reserve({
    tenantId: "tenant-a",
    requestId: "req-1",
    estimatedCostDollars: 0.5,
  });

  assert.throws(
    () =>
      quotas.reserve({
        tenantId: "tenant-a",
        requestId: "req-1",
        estimatedCostDollars: 0.5,
      }),
    /Duplicate reservation/,
  );
});

test("creates a usage record with validated fields", () => {
  const record = createUsageRecord({
    tenantId: "tenant-a",
    requestId: "req-1",
    model: "demo-model",
    inputTokens: 100,
    outputTokens: 50,
    costDollars: 0.001,
    status: "SUCCEEDED",
  });

  assert.equal(record.tenantId, "tenant-a");
  assert.equal(record.inputTokens, 100);
  assert.equal(record.outputTokens, 50);
  assert.ok(record.eventId);
  assert.ok(record.recordedAt);
});

test("rejects invalid usage records", () => {
  assert.throws(
    () =>
      createUsageRecord({
        tenantId: "tenant-a",
        requestId: "req-1",
        model: "demo-model",
        inputTokens: -1,
        outputTokens: 50,
        costDollars: 0.001,
        status: "SUCCEEDED",
      }),
    /non-negative/,
  );
});
