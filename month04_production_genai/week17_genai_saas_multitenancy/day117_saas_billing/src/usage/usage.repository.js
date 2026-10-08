export class UsageRepository {
  constructor() {
    this.records = [];
  }

  record({
    tenantId,
    inputTokens = 0,
    outputTokens = 0,
    requests = 1,
    recordedAt = new Date()
  }) {
    if (!tenantId) throw new Error("TENANT_REQUIRED");

    const input = this.#nonNegativeInteger(inputTokens, "inputTokens");
    const output = this.#nonNegativeInteger(outputTokens, "outputTokens");
    const requestCount = this.#nonNegativeInteger(requests, "requests");

    const record = {
      id: `usage_${this.records.length + 1}`,
      tenantId,
      inputTokens: input,
      outputTokens: output,
      totalTokens: input + output,
      requests: requestCount,
      recordedAt: new Date(recordedAt).toISOString()
    };

    this.records.push(record);
    return record;
  }

  aggregate(tenantId, periodStart, periodEnd) {
    const start = new Date(periodStart).getTime();
    const end = new Date(periodEnd).getTime();

    return this.records
      .filter((record) => {
        const time = new Date(record.recordedAt).getTime();
        return record.tenantId === tenantId && time >= start && time < end;
      })
      .reduce(
        (total, record) => ({
          inputTokens: total.inputTokens + record.inputTokens,
          outputTokens: total.outputTokens + record.outputTokens,
          totalTokens: total.totalTokens + record.totalTokens,
          requests: total.requests + record.requests
        }),
        { inputTokens: 0, outputTokens: 0, totalTokens: 0, requests: 0 }
      );
  }

  #nonNegativeInteger(value, field) {
    if (!Number.isSafeInteger(value) || value < 0) {
      throw new Error(`INVALID_${field.toUpperCase()}`);
    }
    return value;
  }
}
