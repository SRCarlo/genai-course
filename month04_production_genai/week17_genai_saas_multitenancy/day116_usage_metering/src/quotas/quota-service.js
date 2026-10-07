import { PLANS } from "./plans.js";

export class QuotaService {
  constructor(usageService) {
    this.usageService = usageService;
  }

  getPlan(planName) {
    const plan = PLANS[planName];

    if (!plan) {
      throw new Error(`Unknown plan: ${planName}`);
    }

    return plan;
  }

  checkMonthly(tenantId, planName) {
    const plan = this.getPlan(planName);
    const usage = this.usageService.getTenantUsage(tenantId);

    const requestsUsed = usage.requests;
    const tokensUsed = usage.totalTokens;

    return {
      requests: {
        used: requestsUsed,
        limit: plan.monthlyRequests,
        remaining: Math.max(plan.monthlyRequests - requestsUsed, 0),
        allowed: requestsUsed < plan.monthlyRequests
      },
      tokens: {
        used: tokensUsed,
        limit: plan.monthlyTokens,
        remaining: Math.max(plan.monthlyTokens - tokensUsed, 0),
        allowed: tokensUsed < plan.monthlyTokens
      }
    };
  }

  checkProjected({
    tenantId,
    planName,
    estimatedTokens
  }) {
    const result = this.checkMonthly(tenantId, planName);

    const projectedTokens = result.tokens.used + estimatedTokens;
    const projectedRequests = result.requests.used + 1;

    return {
      allowed:
        projectedTokens <= result.tokens.limit &&
        projectedRequests <= result.requests.limit,
      projectedTokens,
      projectedRequests,
      requests: result.requests,
      tokens: result.tokens
    };
  }
}
