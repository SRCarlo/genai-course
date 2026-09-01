import { env } from "../config/env.js";

import { SharedState } from "../state/shared.state.js";

import { SupervisorAgent } from "../agents/supervisor.agent.js";
import { ResearcherAgent } from "../agents/researcher.agent.js";
import { CoderAgent } from "../agents/coder.agent.js";
import { ReviewerAgent } from "../agents/reviewer.agent.js";
import { AggregatorAgent } from "../agents/aggregator.agent.js";

import { AgentExecutor } from "./executor.js";

import { createHandoff } from "./handoff.js";

import { executeWithRetry } from "./retry.js";

import { withTimeout } from "./timeout.js";

import { Logger } from "../observability/logger.js";

export async function runWorkflow(task) {
  const state = new SharedState();

  const logger = new Logger();

  const supervisor = new SupervisorAgent();

  const researcher = new ResearcherAgent();

  const coder = new CoderAgent();

  const reviewer = new ReviewerAgent();

  const aggregator = new AggregatorAgent();

  const executor = new AgentExecutor(
    {
      supervisor,
      researcher,
      coder,
      reviewer,
      aggregator,
    },
    logger,
  );

  /*
   * STEP 1
   * Supervisor creates plan.
   */

  const plan = await executeWithRetry(
    () =>
      withTimeout(
        executor.execute("supervisor", task, state),
        env.agentTimeoutMs,
      ),

    env.maxRetries,

    ({ attempt }) => {
      logger.info(`[SUPERVISOR] retry ${attempt}`);
    },
  );

  /*
   * STEP 2
   * Execute supervisor plan.
   */

  for (const step of plan.plan) {
    state.incrementSteps();

    if (state.get("stepCount") > env.maxSteps) {
      throw new Error("Maximum workflow steps exceeded.");
    }

    const previousAgent = state.get("lastAgent") || "supervisor";

    const handoff = createHandoff({
      from: previousAgent,
      to: step.agent,
      task: step.task,
      context: state.getAll(),
    });

    state.addHandoff(handoff);

    const result = await executeWithRetry(
      () =>
        withTimeout(
          executor.execute(step.agent, step.task, state),
          env.agentTimeoutMs,
        ),

      env.maxRetries,

      ({ attempt }) => {
        logger.info(`[${step.agent.toUpperCase()}] retry ${attempt}`);
      },
    );

    state.set("lastAgent", step.agent);
  }

  /*
   * STEP 3
   * Aggregation.
   */

  await executeWithRetry(
    () =>
      withTimeout(
        executor.execute("aggregator", task, state),
        env.agentTimeoutMs,
      ),

    env.maxRetries,

    ({ attempt }) => {
      logger.info(`[AGGREGATOR] retry ${attempt}`);
    },
  );

  return {
    success: true,

    result: state.get("finalAnswer"),

    workflow: {
      agents: ["supervisor", "researcher", "coder", "reviewer", "aggregator"],

      steps: state.get("stepCount"),

      traces: state.get("traces"),

      handoffs: state.get("handoffs"),
    },

    state: state.getAll(),
  };
}
