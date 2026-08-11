export function createAgentState(sessionId, userMessage) {
  return {
    sessionId,

    userMessage,

    messages: [],

    toolCalls: [],

    toolResults: [],

    currentStep: 0,

    status: "running",

    error: null,
  };
}

export function incrementStep(state) {
  state.currentStep += 1;
}

export function addToolCall(state, toolCall) {
  state.toolCalls.push(toolCall);
}

export function addToolResult(state, result) {
  state.toolResults.push(result);
}

export function completeState(state) {
  state.status = "completed";
}

export function failState(state, error) {
  state.status = "failed";
  state.error = error;
}
