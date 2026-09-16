export function calculateMetrics(results) {
  const total = results.length;
  const passed = results.filter((item) => item.pass).length;
  const failed = total - passed;

  const latencies = results
    .map((item) => item.latencyMs)
    .filter((value) => Number.isFinite(value));

  const averageLatencyMs = latencies.length
    ? Math.round(latencies.reduce((sum, value) => sum + value, 0) / latencies.length)
    : 0;

  return {
    totalCases: total,
    passed,
    failed,
    successRate: total ? Number(((passed / total) * 100).toFixed(1)) : 0,
    averageLatencyMs
  };
}
