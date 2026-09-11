export function addObservation(state, observation) {
  state.observations.push({
    ...observation,

    timestamp: new Date().toISOString(),
  });

  return state;
}

export function addToolCall(state, toolCall) {
  state.toolCalls.push({
    ...toolCall,

    timestamp: new Date().toISOString(),
  });

  return state;
}

export function addError(state, error) {
  state.errors.push({
    code: error.code || "UNKNOWN_ERROR",

    message: error.message,

    timestamp: new Date().toISOString(),
  });

  return state;
}
