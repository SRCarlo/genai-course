export function createBudget() {
  return {
    maxIterations: Number(process.env.MAX_ITERATIONS) || 10,

    maxToolCalls: Number(process.env.MAX_TOOL_CALLS) || 20,

    maxExecutionTimeMs: Number(process.env.MAX_EXECUTION_TIME_MS) || 60000,

    estimatedCost: 0,

    maxCost: Number(process.env.MAX_COST) || 1,
  };
}

export function assertToolBudget(state) {
  if (state.toolCalls.length >= state.budget.maxToolCalls) {
    const error = new Error("TOOL_CALL_BUDGET_EXCEEDED");

    error.code = "TOOL_CALL_BUDGET_EXCEEDED";

    throw error;
  }
}

export function assertIterationBudget(state) {
  if (state.iteration >= state.budget.maxIterations) {
    const error = new Error("MAX_ITERATIONS_EXCEEDED");

    error.code = "MAX_ITERATIONS_EXCEEDED";

    throw error;
  }
}
