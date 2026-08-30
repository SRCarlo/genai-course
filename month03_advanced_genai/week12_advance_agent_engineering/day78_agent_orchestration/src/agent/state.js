export function createAgentState(query) {
  return {
    query,

    messages: [
      {
        role: "user",
        content: query,
      },
    ],

    plan: [],

    currentStep: 0,

    toolCalls: [],

    observations: [],

    iteration: 0,

    llmCalls: 0,

    status: "running",

    finalAnswer: null,

    errors: [],

    events: [],

    checkpoints: [],

    startedAt: Date.now(),

    finishedAt: null,

    requestId: crypto.randomUUID(),
  };
}
