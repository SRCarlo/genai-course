export const PLANS = Object.freeze({
  free: Object.freeze({
    id: "free",
    name: "Free",
    monthlyPriceCents: 0,
    currency: "USD",
    entitlements: Object.freeze({
      maxUsers: 1,
      monthlyTokens: 100_000,
      monthlyRequests: 1_000,
      advancedRag: false,
      agents: false
    }),
    overagePricePerMillionCents: 0
  }),

  starter: Object.freeze({
    id: "starter",
    name: "Starter",
    monthlyPriceCents: 1_900,
    currency: "USD",
    entitlements: Object.freeze({
      maxUsers: 5,
      monthlyTokens: 1_000_000,
      monthlyRequests: 10_000,
      advancedRag: true,
      agents: false
    }),
    overagePricePerMillionCents: 400
  }),

  pro: Object.freeze({
    id: "pro",
    name: "Pro",
    monthlyPriceCents: 4_900,
    currency: "USD",
    entitlements: Object.freeze({
      maxUsers: 20,
      monthlyTokens: 10_000_000,
      monthlyRequests: 100_000,
      advancedRag: true,
      agents: true
    }),
    overagePricePerMillionCents: 400
  })
});

export function getPlanOrThrow(planId) {
  const plan = PLANS[planId];

  if (!plan) {
    throw new Error("PLAN_NOT_FOUND");
  }

  return plan;
}
