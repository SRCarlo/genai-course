import test from "node:test";
import assert from "node:assert/strict";

import { EntitlementService } from "../src/plans/entitlement.service.js";

test("free plan does not have agents", () => {
  const service = new EntitlementService();
  assert.equal(service.canUseFeature("free", "agents"), false);
});

test("pro plan has agents", () => {
  const service = new EntitlementService();
  assert.equal(service.canUseFeature("pro", "agents"), true);
});

test("returns plan limits", () => {
  const service = new EntitlementService();
  assert.equal(service.getLimit("pro", "monthlyTokens"), 10_000_000);
});
