export class InMemoryUsageService {
  constructor() {
    this.events = [];
  }

  async recordUsage({ tenantId, inputTokens, outputTokens, requestId }) {
    if (
      typeof tenantId !== 'string' ||
      !tenantId ||
      !Number.isSafeInteger(inputTokens) ||
      !Number.isSafeInteger(outputTokens) ||
      inputTokens < 0 ||
      outputTokens < 0
    ) {
      throw new Error('INVALID_USAGE');
    }

    const event = {
      requestId: requestId ?? null,
      tenantId,
      inputTokens,
      outputTokens,
      totalTokens: inputTokens + outputTokens,
      recordedAt: new Date().toISOString(),
    };
    this.events.push(event);
    return event;
  }
}
