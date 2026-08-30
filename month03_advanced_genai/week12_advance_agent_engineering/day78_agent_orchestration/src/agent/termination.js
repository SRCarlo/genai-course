export const LIMITS = {
  maxIterations: 8,

  maxToolCalls: 10,

  maxRuntimeMs: 30_000,

  maxLLMCalls: 6,

  maxCostUsd: 0.05,
};

export function shouldTerminate(state) {
  if (state.status !== "running") {
    return true;
  }

  if (state.iteration >= LIMITS.maxIterations) {
    state.status = "max_iterations";
    return true;
  }

  if (state.toolCalls.length >= LIMITS.maxToolCalls) {
    state.status = "max_tool_calls";
    return true;
  }

  if (state.llmCalls >= LIMITS.maxLLMCalls) {
    state.status = "llm_limit";
    return true;
  }

  if (Date.now() - state.startedAt >= LIMITS.maxRuntimeMs) {
    state.status = "timeout";
    return true;
  }

  if (state.costUsd >= LIMITS.maxCostUsd) {
    state.status = "cost_limit";
    return true;
  }

  return false;
}
