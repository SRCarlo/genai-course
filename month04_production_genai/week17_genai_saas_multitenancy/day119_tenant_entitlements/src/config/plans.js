export const PLANS = Object.freeze({
  free: Object.freeze({
    id: "free",
    features: Object.freeze({
      basicChat: true,
      advancedRag: false,
      agents: false,
      analytics: false,
    }),
    limits: Object.freeze({
      maxUsers: 1,
      monthlyTokens: 100_000,
      monthlyRequests: 1_000,
    }),
  }),

  starter: Object.freeze({
    id: "starter",
    features: Object.freeze({
      basicChat: true,
      advancedRag: false,
      agents: false,
      analytics: false,
    }),
    limits: Object.freeze({
      maxUsers: 5,
      monthlyTokens: 1_000_000,
      monthlyRequests: 10_000,
    }),
  }),

  pro: Object.freeze({
    id: "pro",
    features: Object.freeze({
      basicChat: true,
      advancedRag: true,
      agents: true,
      analytics: true,
    }),
    limits: Object.freeze({
      maxUsers: 20,
      monthlyTokens: 10_000_000,
      monthlyRequests: 100_000,
    }),
  }),
});

export const SUBSCRIPTION_STATUSES = Object.freeze([
  "trialing",
  "active",
  "past_due",
  "cancelled",
  "expired",
  "suspended",
]);
