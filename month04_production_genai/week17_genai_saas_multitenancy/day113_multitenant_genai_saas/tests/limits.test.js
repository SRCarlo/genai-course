import test from "node:test";
import assert from "node:assert/strict";

import { TenantRateLimiter } from "../src/limits/rate-limiter.js";
import { BudgetManager } from "../src/limits/budget-manager.js";

test("rate limit is isolated per tenant", () => {
  const limiter = new TenantRateLimiter();

  assert.equal(limiter.allow("tenant-a", 1), true);
  assert.equal(limiter.allow("tenant-a", 1), false);

  assert.equal(limiter.allow("tenant-b", 1), true);
});

test("budget rejects usage above tenant limit", () => {
  const budget = new BudgetManager();

  assert.equal(
    budget.canUse("tenant-a", 500, 1000),
    true
  );

  budget.record("tenant-a", 600);

  assert.equal(
    budget.canUse("tenant-a", 500, 1000),
    false
  );
});