export function evaluateAgent(agentRun) {
  return {
    reasoning: agentRun.reasoning ? 10 : 0,

    toolUsage: agentRun.toolUsed ? 10 : 0,

    finalOutput: agentRun.success ? 10 : 0,
  };
}
