import { WorkflowBudget } from "../policies/budget.js";

import { validateAgentResult } from "../protocol/agent.result.js";

export class SupervisorAgent {
  constructor({
    nodeAgent,
    springAgent,
    fastApiAgent,
    analysisAgent,
    reviewerAgent,
    writerAgent,
  }) {
    this.nodeAgent = nodeAgent;

    this.springAgent = springAgent;

    this.fastApiAgent = fastApiAgent;

    this.analysisAgent = analysisAgent;

    this.reviewerAgent = reviewerAgent;

    this.writerAgent = writerAgent;
  }

  async execute(task, state) {
    const budget = new WorkflowBudget({
      maxAgents: 6,
      maxHandoffs: 10,
      maxLLMCalls: 20,
      maxRuntimeMs: 300000,
    });

    state.status = "running";

    try {
      /*
       * ==================================
       * STEP 1
       * PARALLEL RESEARCH
       * ==================================
       */

      budget.incrementAgents();
      budget.incrementAgents();
      budget.incrementAgents();

      state.trace.push({
        agent: "supervisor-agent",

        event: "parallel-research-started",

        timestamp: new Date().toISOString(),
      });

      const [nodeResult, springResult, fastApiResult] = await Promise.all([
        this.executeResearch(this.nodeAgent, task, budget),

        this.executeResearch(this.springAgent, task, budget),

        this.executeResearch(this.fastApiAgent, task, budget),
      ]);

      state.research.node = this.safeResult(nodeResult);

      state.research.spring = this.safeResult(springResult);

      state.research.fastapi = this.safeResult(fastApiResult);

      /*
       * ==================================
       * STEP 2
       * ANALYSIS
       * ==================================
       */

      budget.incrementAgents();

      budget.incrementLLMCalls();

      const analysisResult = await this.analysisAgent.execute({
        task,

        research: state.research,
      });

      validateAgentResult(analysisResult);

      state.analysis = analysisResult;

      /*
       * ==================================
       * STEP 3
       * REVIEW
       * ==================================
       */

      budget.incrementAgents();

      budget.incrementLLMCalls();

      const reviewResult = await this.reviewerAgent.execute({
        task,

        analysis: state.analysis,
      });

      validateAgentResult(reviewResult);

      state.review = reviewResult;

      /*
       * ==================================
       * STEP 4
       * WRITER
       * ==================================
       */

      budget.incrementAgents();

      budget.incrementLLMCalls();

      const writerResult = await this.writerAgent.execute({
        task,

        research: state.research,

        analysis: state.analysis,

        review: state.review,
      });

      validateAgentResult(writerResult);

      state.finalAnswer = writerResult;

      /*
       * ==================================
       * COMPLETE
       * ==================================
       */

      state.status = "completed";

      state.completedAt = new Date().toISOString();

      state.budget = {
        agents: budget.agents,

        llmCalls: budget.llmCalls,

        handoffs: budget.handoffs,
      };

      state.trace.push({
        agent: "supervisor-agent",

        event: "workflow-completed",

        timestamp: new Date().toISOString(),
      });

      return state;
    } catch (error) {
      state.status = "failed";

      state.error = error.message;

      state.trace.push({
        agent: "supervisor-agent",

        event: "workflow-failed",

        error: error.message,

        timestamp: new Date().toISOString(),
      });

      return state;
    }
  }

  async executeResearch(agent, task, budget) {
    budget.incrementLLMCalls();

    try {
      const result = await agent.execute({
        task,
      });

      return validateAgentResult(result);
    } catch (error) {
      return {
        agent: agent.name,

        status: "failed",

        confidence: 0,

        result: null,

        error: error.message,
      };
    }
  }

  safeResult(result) {
    return {
      agent: result.agent,

      status: result.status,

      confidence: result.confidence,

      result: result.result,

      error: result.error,
    };
  }
}
