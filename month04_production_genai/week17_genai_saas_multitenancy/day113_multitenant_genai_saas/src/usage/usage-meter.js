export class UsageMeter {
  constructor() {
    this.records = [];
  }

  record({
    tenantId,
    userId,
    model,
    inputTokens,
    outputTokens
  }) {
    const record = {
      tenantId,
      userId,
      model,
      inputTokens,
      outputTokens,
      totalTokens: inputTokens + outputTokens,
      timestamp: new Date().toISOString()
    };

    this.records.push(record);
    return { ...record };
  }

  getTenantUsage(tenantId) {
    return this.records
      .filter((record) => record.tenantId === tenantId)
      .map((record) => ({ ...record }));
  }

  summarizeTenant(tenantId) {
    const records = this.getTenantUsage(tenantId);

    return records.reduce(
      (summary, record) => ({
        requests: summary.requests + 1,
        inputTokens: summary.inputTokens + record.inputTokens,
        outputTokens: summary.outputTokens + record.outputTokens,
        totalTokens: summary.totalTokens + record.totalTokens
      }),
      {
        requests: 0,
        inputTokens: 0,
        outputTokens: 0,
        totalTokens: 0
      }
    );
  }
}