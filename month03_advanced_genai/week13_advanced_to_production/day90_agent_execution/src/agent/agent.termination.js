export function shouldTerminate(state) {
  if (state.status === "completed") {
    return true;
  }

  if (state.status === "waiting_for_approval") {
    return true;
  }

  if (state.status === "terminated") {
    return true;
  }

  if (state.iteration >= state.budget.maxIterations) {
    return true;
  }

  if (state.toolCalls.length >= state.budget.maxToolCalls) {
    return true;
  }

  return false;
}
