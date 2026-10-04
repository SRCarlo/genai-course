const PRICING_USD_PER_MILLION = Object.freeze({
  "openai/gpt-oss-20b": Object.freeze({
    input: 0.075,
    output: 0.30
  })
});

export class CostTracker {
  estimate({ model, inputTokens, outputTokens }) {
    const pricing = PRICING_USD_PER_MILLION[model];

    if (!pricing) {
      throw new Error(`No pricing configured for model: ${model}`);
    }

    const inputCost = (inputTokens / 1_000_000) * pricing.input;
    const outputCost = (outputTokens / 1_000_000) * pricing.output;

    return Number((inputCost + outputCost).toFixed(8));
  }

  getTenantCost(usageRecords) {
    return Number(
      usageRecords
        .reduce(
          (total, record) =>
            total +
            this.estimate({
              model: record.model,
              inputTokens: record.inputTokens,
              outputTokens: record.outputTokens
            }),
          0
        )
        .toFixed(8)
    );
  }
}