export class CostTracker {
  constructor({ inputPerMillion = 0.075, outputPerMillion = 0.3 } = {}) {
    this.inputPerMillion = inputPerMillion;
    this.outputPerMillion = outputPerMillion;
    this.reset();
  }
  reset() {
    this.requests = 0;
    this.inputTokens = 0;
    this.outputTokens = 0;
    this.estimatedCostUsd = 0;
  }
  record(usage = {}) {
    const input = usage.inputTokens || 0;
    const output = usage.outputTokens || 0;
    this.requests += 1;
    this.inputTokens += input;
    this.outputTokens += output;
    this.estimatedCostUsd +=
      (input / 1e6) * this.inputPerMillion +
      (output / 1e6) * this.outputPerMillion;
  }
  summary() {
    return {
      requests: this.requests,
      inputTokens: this.inputTokens,
      outputTokens: this.outputTokens,
      estimatedCostUsd: Number(this.estimatedCostUsd.toFixed(8)),
    };
  }
}
