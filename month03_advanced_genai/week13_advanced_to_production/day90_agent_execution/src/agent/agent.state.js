export const AgentStatus = Object.freeze({
  PENDING: "pending",
  PLANNING: "planning",
  EXECUTING: "executing",
  OBSERVING: "observing",
  RECOVERING: "recovering",
  COMPLETED: "completed",
  FAILED: "failed",
  TERMINATED: "terminated",
  WAITING_FOR_APPROVAL: "waiting_for_approval",
});

export function createAgentState(goal) {
  return {
    goal,

    status: AgentStatus.PENDING,

    plan: [],

    currentStep: 0,

    observations: [],

    toolCalls: [],

    errors: [],

    result: null,

    iteration: 0,

    budget: {
      maxIterations: Number(process.env.MAX_ITERATIONS) || 10,

      maxToolCalls: Number(process.env.MAX_TOOL_CALLS) || 20,

      maxExecutionTimeMs: Number(process.env.MAX_EXECUTION_TIME_MS) || 60000,

      estimatedCost: 0,

      maxCost: Number(process.env.MAX_COST) || 1,
    },

    metadata: {
      requestId: `req-${crypto.randomUUID()}`,
      agentId: "customer-support-agent",
      startedAt: new Date().toISOString(),
    },
  };
}
