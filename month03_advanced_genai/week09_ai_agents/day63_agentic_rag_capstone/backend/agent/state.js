export function createAgentState({ question, sessionId }) {
  return {
    question,

    sessionId,

    // IMPORTANT:
    // The original user message must be
    // present BEFORE any assistant/tool messages.
    history: [
      {
        role: "user",
        content: question,
      },
    ],

    observations: [],

    sources: [],

    trace: [],

    iteration: 0,

    toolCalls: 0,

    ragCalls: 0,

    maxIterations: Number(process.env.MAX_ITERATIONS || 10),

    maxToolCalls: Number(process.env.MAX_TOOL_CALLS || 8),

    maxRagCalls: Number(process.env.MAX_RAG_CALLS || 3),

    finalAnswer: null,

    status: "running",
  };
}
