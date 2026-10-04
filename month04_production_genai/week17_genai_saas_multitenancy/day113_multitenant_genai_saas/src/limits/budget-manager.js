export class BudgetManager {
  constructor() {
    this.usage = new Map();
  }

  getUsage(tenantId) {
    return this.usage.get(tenantId) ?? 0;
  }

  canUse(tenantId, requestedTokens, monthlyLimit) {
    return this.getUsage(tenantId) + requestedTokens <= monthlyLimit;
  }

  record(tenantId, tokens) {
    const current = this.getUsage(tenantId);
    const next = current + tokens;
    this.usage.set(tenantId, next);
    return next;
  }

  getRemaining(tenantId, monthlyLimit) {
    return Math.max(0, monthlyLimit - this.getUsage(tenantId));
  }
}