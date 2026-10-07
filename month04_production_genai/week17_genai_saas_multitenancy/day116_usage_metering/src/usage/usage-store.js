export class UsageStore {
  constructor() {
    this.records = [];
    this.requestIds = new Set();
  }

  add(record) {
    if (this.requestIds.has(record.requestId)) {
      return this.records.find(
        (existing) => existing.requestId === record.requestId
      );
    }

    this.requestIds.add(record.requestId);
    this.records.push(record);
    return record;
  }

  listByTenant(tenantId) {
    return this.records.filter((record) => record.tenantId === tenantId);
  }

  listByUser(userId) {
    return this.records.filter((record) => record.userId === userId);
  }

  listByApiKey(apiKeyId) {
    return this.records.filter((record) => record.apiKeyId === apiKeyId);
  }

  listByModel(model) {
    return this.records.filter((record) => record.model === model);
  }

  all() {
    return [...this.records];
  }
}
