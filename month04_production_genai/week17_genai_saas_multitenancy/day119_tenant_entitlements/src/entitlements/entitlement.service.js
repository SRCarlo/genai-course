import { PLANS, SUBSCRIPTION_STATUSES } from "../config/plans.js";

const ALLOWED_STATUSES = new Set(["active", "trialing"]);

export class EntitlementService {
  constructor(subscriptionRepository, { clock = () => Date.now() } = {}) {
    this.subscriptionRepository = subscriptionRepository;
    this.clock = clock;
  }

  async getEntitlements(tenantId) {
    if (!tenantId) throw new Error("TENANT_ID_REQUIRED");

    const subscription = await this.subscriptionRepository.findByTenantId(tenantId);
    if (!subscription) throw new Error("SUBSCRIPTION_NOT_FOUND");

    if (!SUBSCRIPTION_STATUSES.includes(subscription.status)) {
      throw new Error("INVALID_SUBSCRIPTION_STATUS");
    }

    const plan = PLANS[subscription.planId];
    if (!plan) throw new Error("PLAN_NOT_FOUND");

    const periodEnd = subscription.currentPeriodEnd
      ? Date.parse(subscription.currentPeriodEnd)
      : null;

    if (subscription.currentPeriodEnd && !Number.isFinite(periodEnd)) {
      throw new Error("INVALID_SUBSCRIPTION_PERIOD_END");
    }

    // A scheduled cancellation remains active until the period ends.
    const periodExpired = periodEnd !== null && periodEnd <= this.clock();
    const subscriptionAllowed =
      ALLOWED_STATUSES.has(subscription.status) && !periodExpired;

    const features = subscriptionAllowed
      ? { ...plan.features }
      : Object.fromEntries(Object.keys(plan.features).map(key => [key, false]));

    const limits = subscriptionAllowed
      ? { ...plan.limits }
      : { maxUsers: 0, monthlyTokens: 0, monthlyRequests: 0 };

    return {
      tenantId,
      planId: plan.id,
      subscriptionStatus: subscription.status,
      currentPeriodEnd: subscription.currentPeriodEnd,
      cancelAtPeriodEnd: Boolean(subscription.cancelAtPeriodEnd),
      accessAllowed: subscriptionAllowed,
      features,
      limits
    };
  }

  async requireFeature(tenantId, feature) {
    const entitlements = await this.getEntitlements(tenantId);

    if (!entitlements.accessAllowed) {
      throw new Error("SUBSCRIPTION_ACCESS_DENIED");
    }

    if (!Object.hasOwn(entitlements.features, feature)) {
      throw new Error("UNKNOWN_FEATURE");
    }

    if (entitlements.features[feature] !== true) {
      throw new Error("FEATURE_NOT_ENTITLED");
    }

    return entitlements;
  }
}
