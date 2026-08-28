export function createAgentState(query) {
  return {
    query,

    messages: [
      {
        role: "user",
        content: query,
      },
    ],

    toolCalls: [],
    observations: [],

    iteration: 0,

    status: "running",

    finalAnswer: null,

    sources: [],

    errors: [],

    startedAt: Date.now(),

    metrics: {
      llmCalls: 0,
      toolCalls: 0,
      totalToolLatencyMs: 0,
    },
  };
}
