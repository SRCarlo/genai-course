export function agentSuccess(agent, data, nextAgent = null) {
  return {
    success: true,

    agent,

    data,

    nextAgent,

    error: null,
  };
}

export function agentFailure(agent, error) {
  return {
    success: false,

    agent,

    data: null,

    nextAgent: null,

    error: error instanceof Error ? error.message : String(error),
  };
}
