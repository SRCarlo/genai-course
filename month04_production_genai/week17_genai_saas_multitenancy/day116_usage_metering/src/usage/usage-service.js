import { aggregateUsage, groupUsageBy } from "./usage-aggregator.js";

export class UsageService {
  constructor(store) {
    this.store = store;
  }

  getTenantUsage(tenantId) {
    return aggregateUsage(this.store.listByTenant(tenantId));
  }

  getUserUsage(userId) {
    return aggregateUsage(this.store.listByUser(userId));
  }

  getApiKeyUsage(apiKeyId) {
    return aggregateUsage(this.store.listByApiKey(apiKeyId));
  }

  getModelUsage(tenantId) {
    const records = this.store.listByTenant(tenantId);

    return groupUsageBy(records, (record) => record.model).map((item) => ({
      model: item.key,
      requests: item.requests,
      inputTokens: item.inputTokens,
      outputTokens: item.outputTokens,
      tokens: item.totalTokens,
      cost: item.estimatedCost
    }));
  }

  getApiKeyUsageByTenant(tenantId) {
    const records = this.store.listByTenant(tenantId);

    return groupUsageBy(records, (record) => record.apiKeyId).map((item) => ({
      apiKeyId: item.key,
      requests: item.requests,
      inputTokens: item.inputTokens,
      outputTokens: item.outputTokens,
      tokens: item.totalTokens,
      cost: item.estimatedCost
    }));
  }

  getUserUsageByTenant(tenantId) {
    const records = this.store.listByTenant(tenantId);

    return groupUsageBy(records, (record) => record.userId).map((item) => ({
      userId: item.key,
      requests: item.requests,
      inputTokens: item.inputTokens,
      outputTokens: item.outputTokens,
      tokens: item.totalTokens,
      cost: item.estimatedCost
    }));
  }
}
