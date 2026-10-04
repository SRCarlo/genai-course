const policies = Object.freeze({
  free: Object.freeze({
    maxRequestsPerMinute: 10,
    monthlyTokens: 10_000,
    allowedModels: ["fast"]
  }),
  pro: Object.freeze({
    maxRequestsPerMinute: 100,
    monthlyTokens: 100_000,
    allowedModels: ["fast", "balanced"]
  }),
  enterprise: Object.freeze({
    maxRequestsPerMinute: 1_000,
    monthlyTokens: 1_000_000,
    allowedModels: ["fast", "balanced", "quality"]
  })
});

export class TenantPolicy {
  get(plan) {
    const policy = policies[plan];

    if (!policy) {
      throw new Error(`Unknown plan: ${plan}`);
    }

    return policy;
  }

  list() {
    return Object.entries(policies).map(([plan, policy]) => ({
      plan,
      ...policy
    }));
  }
}