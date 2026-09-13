import { createWorkflowState } from "./workflow.state.js";

import { saveWorkflow } from "../storage/workflow.store.js";

import { ResearchAgent } from "../agents/research.agent.js";

import { AnalysisAgent } from "../agents/analysis.agent.js";

import { ReviewerAgent } from "../agents/reviewer.agent.js";

import { WriterAgent } from "../agents/writer.agent.js";

import { SupervisorAgent } from "../agents/supervisor.agent.js";

export async function runMultiAgentWorkflow(task) {
  const state = createWorkflowState(task);

  saveWorkflow(state);

  /*
   * =================================
   * SPECIALIZED AGENTS
   * =================================
   */

  const nodeAgent = new ResearchAgent({
    name: "node-agent",

    technology: "Node.js",
  });

  const springAgent = new ResearchAgent({
    name: "spring-agent",

    technology: "Spring Boot",
  });

  const fastApiAgent = new ResearchAgent({
    name: "fastapi-agent",

    technology: "FastAPI",
  });

  const analysisAgent = new AnalysisAgent();

  const reviewerAgent = new ReviewerAgent();

  const writerAgent = new WriterAgent();

  /*
   * =================================
   * SUPERVISOR
   * =================================
   */

  const supervisor = new SupervisorAgent({
    nodeAgent,

    springAgent,

    fastApiAgent,

    analysisAgent,

    reviewerAgent,

    writerAgent,
  });

  /*
   * =================================
   * RUN WORKFLOW
   * =================================
   */

  const result = await supervisor.execute(task, state);

  saveWorkflow(result);

  return result;
}
