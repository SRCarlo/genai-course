let metrics = {
  requests: 0,

  errors: 0,

  latency: [],
};

export function trackRequest() {
  metrics.requests++;
}

export function trackError() {
  metrics.errors++;
}

export function trackLatency(time) {
  metrics.latency.push(time);
}

export function getMetrics() {
  let averageLatency = 0;

  if (metrics.latency.length) {
    averageLatency =
      metrics.latency.reduce((a, b) => a + b, 0) / metrics.latency.length;
  }

  return {
    requests: metrics.requests,

    errors: metrics.errors,

    averageLatency,
  };
}
