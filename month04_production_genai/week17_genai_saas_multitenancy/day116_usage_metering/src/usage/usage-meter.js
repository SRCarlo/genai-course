import crypto from "node:crypto";

export class UsageMeter {
  constructor(store) {
    this.store = store;
  }

  record({
    requestId = `req_${crypto.randomUUID()}`,
    tenantId,
    userId,
    apiKeyId,
    operation = "chat",
    model,
    inputTokens,
    outputTokens,
    latencyMs,
    cost
  }) {
    const record = {
      requestId,
      tenantId,
      userId,
      apiKeyId,
      operation,
      model,
      inputTokens,
      outputTokens,
      totalTokens: inputTokens + outputTokens,
      latencyMs,
      cost,
      timestamp: new Date().toISOString()
    };

    return this.store.add(record);
  }
}
