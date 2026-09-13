export class WorkflowBudget {
  constructor({
    maxAgents = 6,
    maxHandoffs = 10,
    maxLLMCalls = 20,
    maxRuntimeMs = 300000
  } = {}) {
    this.maxAgents = maxAgents;
    this.maxHandoffs = maxHandoffs;
    this.maxLLMCalls = maxLLMCalls;
    this.maxRuntimeMs = maxRuntimeMs;

    this.agents = 0;
    this.handoffs = 0;
    this.llmCalls = 0;

    this.startedAt = Date.now();
  }

  checkRuntime() {
    const elapsed =
      Date.now() - this.startedAt;

    if (elapsed > this.maxRuntimeMs) {
      throw new Error(
        "WORKFLOW_LIMIT_EXCEEDED: max runtime exceeded"
      );
    }
  }

  incrementAgents() {
    this.agents++;

    if (this.agents > this.maxAgents) {
      throw new Error(
        "WORKFLOW_LIMIT_EXCEEDED: max agents exceeded"
      );
    }

    this.checkRuntime();
  }

  incrementHandoffs() {
    this.handoffs++;

    if (this.handoffs > this.maxHandoffs) {
      throw new Error(
        "MAX_HANDOFFS_EXCEEDED"
      );
    }

    this.checkRuntime();
  }

  incrementLLMCalls() {
    this.llmCalls++;

    if (this.llmCalls > this.maxLLMCalls) {
      throw new Error(
        "WORKFLOW_LIMIT_EXCEEDED: max LLM calls exceeded"
      );
    }

    this.checkRuntime();
  }

  getUsage() {
    return {
      agents: this.agents,
      handoffs: this.handoffs,
      llmCalls: this.llmCalls,
      runtimeMs: Date.now() - this.startedAt
    };
  }
}