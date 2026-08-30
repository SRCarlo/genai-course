export function addObservation(state, observation) {
  state.observations.push({
    ...observation,
    timestamp: new Date().toISOString(),
  });
}

export function getRecentObservations(state, limit = 5) {
  return state.observations.slice(-limit);
}

export function addMessage(state, message) {
  state.messages.push(message);
}
