export function createAgentState({
  input,
  role = "user",
  customerId = "CUST-001",
  sessionId = "default"
}) {
  return {
    input,
    role,
    customerId,
    sessionId,
    messages: [],
    toolCalls: [],
    results: [],
    status: "initialized",
    errors: [],
    plan: null,
    answer: null,
    traceId: null,
    startedAt: Date.now()
  };
}

export function completeState(state, answer) {
  state.answer = answer;
  state.status = "completed";
  state.durationMs = Date.now() - state.startedAt;
  return state;
}

export function failState(state, error) {
  state.status = "failed";
  state.errors.push({
    name: error.name,
    message: error.message
  });
  state.durationMs = Date.now() - state.startedAt;
  return state;
}
