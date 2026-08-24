const state = {
  requestsTotal: 0,
  requestsSuccessful: 0,
  requestsFailed: 0,

  totalRequestLatencyMs: 0,
  requestLatenciesMs: [],

  aiRequestsTotal: 0,
  aiFailuresTotal: 0,
  aiLatencyMs: [],

  inputTokensTotal: 0,
  outputTokensTotal: 0,

  totalCostUsd: 0,

  modelUsage: {},

  tenantUsage: {},

  ragRequestsTotal: 0,
  ragFailuresTotal: 0,
  ragLatencyMs: [],
  documentsRetrievedTotal: 0,

  agentRunsTotal: 0,
  agentIterationsTotal: 0,

  toolCallsTotal: 0,
  toolFailuresTotal: 0,
};

function recordLatency(collection, value) {
  collection.push(value);

  // Keep the demo memory bounded.
  if (collection.length > 10000) {
    collection.shift();
  }
}

export function recordRequest({ latencyMs, success }) {
  state.requestsTotal++;

  state.totalRequestLatencyMs += latencyMs;

  recordLatency(state.requestLatenciesMs, latencyMs);

  if (success) {
    state.requestsSuccessful++;
  } else {
    state.requestsFailed++;
  }
}

export function recordAIUsage({
  model,
  tenantId,
  inputTokens = 0,
  outputTokens = 0,
  costUsd = 0,
  latencyMs,
  success,
}) {
  state.aiRequestsTotal++;

  state.inputTokensTotal += inputTokens;

  state.outputTokensTotal += outputTokens;

  state.totalCostUsd += costUsd;

  recordLatency(state.aiLatencyMs, latencyMs);

  if (!success) {
    state.aiFailuresTotal++;
  }

  if (!state.modelUsage[model]) {
    state.modelUsage[model] = {
      requests: 0,
      failures: 0,
      inputTokens: 0,
      outputTokens: 0,
      costUsd: 0,
      latencyMs: [],
    };
  }

  const modelMetrics = state.modelUsage[model];

  modelMetrics.requests++;

  modelMetrics.inputTokens += inputTokens;

  modelMetrics.outputTokens += outputTokens;

  modelMetrics.costUsd += costUsd;

  modelMetrics.latencyMs.push(latencyMs);

  if (!success) {
    modelMetrics.failures++;
  }

  if (!state.tenantUsage[tenantId]) {
    state.tenantUsage[tenantId] = {
      requests: 0,
      inputTokens: 0,
      outputTokens: 0,
      costUsd: 0,
    };
  }

  const tenantMetrics = state.tenantUsage[tenantId];

  tenantMetrics.requests++;

  tenantMetrics.inputTokens += inputTokens;

  tenantMetrics.outputTokens += outputTokens;

  tenantMetrics.costUsd += costUsd;
}

export function recordRagUsage({ latencyMs, documentsRetrieved, success }) {
  state.ragRequestsTotal++;

  recordLatency(state.ragLatencyMs, latencyMs);

  state.documentsRetrievedTotal += documentsRetrieved;

  if (!success) {
    state.ragFailuresTotal++;
  }
}

export function recordAgentRun() {
  state.agentRunsTotal++;
}

export function recordAgentIteration() {
  state.agentIterationsTotal++;
}

export function recordToolCall({ success }) {
  state.toolCallsTotal++;

  if (!success) {
    state.toolFailuresTotal++;
  }
}

function percentile(values, percentileValue) {
  if (!values.length) {
    return 0;
  }

  const sorted = [...values].sort((a, b) => a - b);

  const index = Math.ceil((percentileValue / 100) * sorted.length) - 1;

  return Number(sorted[Math.max(0, index)].toFixed(2));
}

export function getMetrics() {
  const errorRate =
    state.requestsTotal === 0
      ? 0
      : (state.requestsFailed / state.requestsTotal) * 100;

  const aiErrorRate =
    state.aiRequestsTotal === 0
      ? 0
      : (state.aiFailuresTotal / state.aiRequestsTotal) * 100;

  return {
    requests: {
      total: state.requestsTotal,

      successful: state.requestsSuccessful,

      failed: state.requestsFailed,

      errorRatePercent: Number(errorRate.toFixed(2)),

      latency: {
        p50: percentile(state.requestLatenciesMs, 50),

        p95: percentile(state.requestLatenciesMs, 95),

        p99: percentile(state.requestLatenciesMs, 99),
      },
    },

    ai: {
      requests: state.aiRequestsTotal,

      failures: state.aiFailuresTotal,

      errorRatePercent: Number(aiErrorRate.toFixed(2)),

      latency: {
        p50: percentile(state.aiLatencyMs, 50),

        p95: percentile(state.aiLatencyMs, 95),

        p99: percentile(state.aiLatencyMs, 99),
      },

      tokens: {
        input: state.inputTokensTotal,

        output: state.outputTokensTotal,

        total: state.inputTokensTotal + state.outputTokensTotal,
      },

      costUsd: Number(state.totalCostUsd.toFixed(6)),
    },

    models: Object.fromEntries(
      Object.entries(state.modelUsage).map(([model, metrics]) => [
        model,
        {
          ...metrics,

          errorRatePercent:
            metrics.requests === 0
              ? 0
              : Number(
                  ((metrics.failures / metrics.requests) * 100).toFixed(2),
                ),

          p95: percentile(metrics.latencyMs, 95),
        },
      ]),
    ),

    tenants: state.tenantUsage,

    rag: {
      requests: state.ragRequestsTotal,

      failures: state.ragFailuresTotal,

      failureRatePercent:
        state.ragRequestsTotal === 0
          ? 0
          : Number(
              ((state.ragFailuresTotal / state.ragRequestsTotal) * 100).toFixed(
                2,
              ),
            ),

      documentsRetrieved: state.documentsRetrievedTotal,

      p95LatencyMs: percentile(state.ragLatencyMs, 95),
    },

    agents: {
      runs: state.agentRunsTotal,

      iterations: state.agentIterationsTotal,

      toolCalls: state.toolCallsTotal,

      toolFailures: state.toolFailuresTotal,
    },
  };
}

export function resetMetrics() {
  for (const key of Object.keys(state)) {
    if (Array.isArray(state[key])) {
      state[key].length = 0;
    } else if (typeof state[key] === "object") {
      state[key] = {};
    } else {
      state[key] = 0;
    }
  }
}
