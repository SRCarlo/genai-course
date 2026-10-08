import test from "node:test";
import assert from "node:assert/strict";

import { SubscriptionService } from "../src/billing/subscription.service.js";

test("creates and reads a subscription", () => {
  const service = new SubscriptionService();

  const subscription = service.createSubscription({
    tenantId: "tenant_1",
    planId: "starter"
  });

  assert.equal(subscription.planId, "starter");
  assert.equal(service.getSubscription("tenant_1").id, subscription.id);
});

test("upgrades a subscription", () => {
  const service = new SubscriptionService();

  service.createSubscription({
    tenantId: "tenant_1",
    planId: "starter"
  });

  const result = service.upgradeSubscription("tenant_1", "pro");

  assert.equal(result.oldPlanId, "starter");
  assert.equal(result.subscription.planId, "pro");
});

test("downgrade is scheduled for period end", () => {
  const service = new SubscriptionService();

  service.createSubscription({
    tenantId: "tenant_1",
    planId: "pro"
  });

  const subscription = service.downgradeSubscription("tenant_1", "starter");

  assert.equal(subscription.pendingPlanId, "starter");
  assert.equal(subscription.cancelAtPeriodEnd, true);
});

test("cancels immediately", () => {
  const service = new SubscriptionService();

  service.createSubscription({
    tenantId: "tenant_1",
    planId: "pro"
  });

  const subscription = service.cancelSubscription("tenant_1", {
    immediately: true
  });

  assert.equal(subscription.status, "cancelled");
});
