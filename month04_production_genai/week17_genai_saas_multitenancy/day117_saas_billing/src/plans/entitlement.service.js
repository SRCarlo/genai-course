import { getPlanOrThrow } from "./plans.js";

export class EntitlementService {
  getPlan(planId) {
    return getPlanOrThrow(planId);
  }

  getEntitlements(planId) {
    return this.getPlan(planId).entitlements;
  }

  canUseFeature(planId, feature) {
    return Boolean(this.getEntitlements(planId)[feature]);
  }

  getLimit(planId, limitName) {
    const value = this.getEntitlements(planId)[limitName];

    if (value === undefined) {
      throw new Error("ENTITLEMENT_NOT_FOUND");
    }

    return value;
  }
}
