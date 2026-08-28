const MAX_ITERATIONS = Number(process.env.AGENT_MAX_ITERATIONS || 8);

const MAX_TOOL_CALLS = Number(process.env.AGENT_MAX_TOOL_CALLS || 10);

const MAX_EXECUTION_TIME_MS = Number(process.env.AGENT_TIMEOUT_MS || 30000);

export function shouldTerminate(state) {
  if (state.status !== "running") {
    return true;
  }

  if (state.iteration >= MAX_ITERATIONS) {
    state.status = "max_iterations";
    return true;
  }

  if (state.toolCalls.length >= MAX_TOOL_CALLS) {
    state.status = "max_tool_calls";
    return true;
  }

  if (Date.now() - state.startedAt >= MAX_EXECUTION_TIME_MS) {
    state.status = "timeout";
    return true;
  }

  return false;
}

export function getTerminationMessage(state) {
  switch (state.status) {
    case "max_iterations":
      return "The agent reached its maximum number of iterations.";

    case "max_tool_calls":
      return "The agent reached its maximum number of tool calls.";

    case "timeout":
      return "The agent exceeded its execution time limit.";

    case "error":
      return "The agent stopped because of an internal error.";

    default:
      return null;
  }
}
