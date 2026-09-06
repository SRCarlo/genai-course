export function createTrace({
  requestId,
  query
}) {
  return {
    requestId,

    query,

    rewrittenQuery: null,

    retrieval: {
      vectorResults: [],
      keywordResults: [],
      hybridResults: [],
      rerankedResults: []
    },

    context: {
      chunks: [],
      tokenCount: 0
    },

    generation: {
      model: null,
      inputTokens: 0,
      outputTokens: 0,
      totalTokens: 0,
      latencyMs: 0
    },

    timings: {},

    cost: {
      inputCost: 0,
      outputCost: 0,
      totalCost: 0
    },

    errors: [],

    totalLatencyMs: 0,

    startedAt:
      new Date().toISOString(),

    completedAt: null
  };
}

export function finishTrace(trace) {
  trace.completedAt =
    new Date().toISOString();

  return trace;
}