export function aggregateUsage(records) {
  return records.reduce(
    (total, record) => {
      total.requests += 1;
      total.inputTokens += record.inputTokens;
      total.outputTokens += record.outputTokens;
      total.totalTokens += record.totalTokens;
      total.estimatedCost += record.cost.totalCost;
      total.latencyMs += record.latencyMs;
      return total;
    },
    {
      requests: 0,
      inputTokens: 0,
      outputTokens: 0,
      totalTokens: 0,
      estimatedCost: 0,
      latencyMs: 0
    }
  );
}

export function groupUsageBy(records, getKey) {
  const groups = new Map();

  for (const record of records) {
    const key = getKey(record);
    const existing = groups.get(key) ?? {
      key,
      requests: 0,
      inputTokens: 0,
      outputTokens: 0,
      totalTokens: 0,
      estimatedCost: 0
    };

    existing.requests += 1;
    existing.inputTokens += record.inputTokens;
    existing.outputTokens += record.outputTokens;
    existing.totalTokens += record.totalTokens;
    existing.estimatedCost += record.cost.totalCost;

    groups.set(key, existing);
  }

  return [...groups.values()];
}
