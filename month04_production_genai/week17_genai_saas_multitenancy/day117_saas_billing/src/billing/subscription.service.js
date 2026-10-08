import crypto from "node:crypto";
import { getPlanOrThrow } from "../plans/plans.js";

const ACTIVE_STATUSES = new Set(["trialing", "active", "past_due"]);

export class SubscriptionService {
  constructor() {
    this.subscriptions = new Map();
  }

  createSubscription({
    tenantId,
    planId,
    periodStart = new Date(),
    periodEnd,
    status = "active"
  }) {
    if (!tenantId || !planId) {
      throw new Error("SUBSCRIPTION_FIELDS_REQUIRED");
    }

    getPlanOrThrow(planId);

    const existing = this.getSubscription(tenantId);
    if (existing) {
      throw new Error("ACTIVE_SUBSCRIPTION_EXISTS");
    }

    const start = new Date(periodStart);
    const end = periodEnd
      ? new Date(periodEnd)
      : new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + 1, start.getUTCDate()));

    const subscription = {
      id: `sub_${crypto.randomUUID()}`,
      tenantId,
      planId,
      status,
      currentPeriodStart: start.toISOString(),
      currentPeriodEnd: end.toISOString(),
      cancelAtPeriodEnd: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.subscriptions.set(subscription.id, subscription);
    return subscription;
  }

  getSubscription(tenantId) {
    return [...this.subscriptions.values()].find(
      (subscription) =>
        subscription.tenantId === tenantId &&
        ACTIVE_STATUSES.has(subscription.status)
    );
  }

  getById(subscriptionId) {
    return this.subscriptions.get(subscriptionId);
  }

  upgradeSubscription(tenantId, newPlanId) {
    return this.changePlan(tenantId, newPlanId);
  }

  downgradeSubscription(tenantId, newPlanId) {
    const subscription = this.getSubscription(tenantId);
    if (!subscription) throw new Error("SUBSCRIPTION_NOT_FOUND");

    getPlanOrThrow(newPlanId);

    subscription.pendingPlanId = newPlanId;
    subscription.cancelAtPeriodEnd = true;
    subscription.updatedAt = new Date().toISOString();

    return subscription;
  }

  cancelSubscription(tenantId, { immediately = false } = {}) {
    const subscription = this.getSubscription(tenantId);
    if (!subscription) throw new Error("SUBSCRIPTION_NOT_FOUND");

    if (immediately) {
      subscription.status = "cancelled";
      subscription.cancelAtPeriodEnd = false;
    } else {
      subscription.cancelAtPeriodEnd = true;
    }

    subscription.updatedAt = new Date().toISOString();
    return subscription;
  }

  changePlan(tenantId, newPlanId) {
    const subscription = this.getSubscription(tenantId);
    if (!subscription) throw new Error("SUBSCRIPTION_NOT_FOUND");

    getPlanOrThrow(newPlanId);

    const oldPlanId = subscription.planId;
    subscription.planId = newPlanId;
    subscription.cancelAtPeriodEnd = false;
    subscription.updatedAt = new Date().toISOString();

    return { subscription, oldPlanId, newPlanId };
  }
}
