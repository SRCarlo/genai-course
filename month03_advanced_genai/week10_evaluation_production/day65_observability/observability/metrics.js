export function calculatePercentile(values, percentile) {
  if (!values.length) {
    return 0;
  }

  const sorted = [...values].sort((a, b) => a - b);

  const index = Math.ceil((percentile / 100) * sorted.length) - 1;

  return sorted[Math.max(0, index)];
}
