export function percentile(values, percentileValue) {
  if (!values.length) return 0;

  const sorted = [...values].sort((a, b) => a - b);
  const index =
    Math.ceil((percentileValue / 100) * sorted.length) - 1;

  return sorted[Math.max(0, index)];
}

export function summarizeLatencies(values) {
  if (!values.length) {
    return {
      count: 0,
      average: 0,
      p50: 0,
      p95: 0,
      p99: 0
    };
  }

  const total = values.reduce((sum, value) => sum + value, 0);

  return {
    count: values.length,
    average: Number((total / values.length).toFixed(2)),
    p50: percentile(values, 50),
    p95: percentile(values, 95),
    p99: percentile(values, 99)
  };
}
