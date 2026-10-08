import { getPlanOrThrow } from "../plans/plans.js";

export function getUsagePricing(planId) {
  const plan = getPlanOrThrow(planId);

  return {
    includedTokens: plan.entitlements.monthlyTokens,
    pricePerMillionCents: plan.overagePricePerMillionCents
  };
}
