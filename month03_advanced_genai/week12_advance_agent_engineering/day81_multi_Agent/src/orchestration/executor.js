import { validateAgentResult } from "./schemas.js";

import { retry, withTimeout } from "./retry.js";

import { requirePermission } from "./permissions.js";

import { logger } from "./logger.js";

export class AgentExecutor {
  constructor({
    router,

    maxAttempts = 3,

    timeoutMs = 30000,
  }) {
    this.router = router;

    this.maxAttempts = maxAttempts;

    this.timeoutMs = timeoutMs;
  }

  async execute(agentName, input, state) {
    const agent = this.router.get(agentName);

    state.set("currentAgent", agentName);

    const step = state.increment("step");

    if (step > state.get("maxSteps")) {
      throw new Error("Maximum workflow steps exceeded");
    }

    logger.info("Agent execution started", {
      runId: state.get("runId"),

      agent: agentName,

      step,
    });

    state.addHistory({
      agent: agentName,

      status: "started",

      step,
    });

    try {
      const result = await retry(
        async (attempt) => {
          state.set("currentAttempt", attempt);

          state.addHistory({
            agent: agentName,

            status: "attempt",

            attempt,
          });

          const execution = agent.run(input, state);

          const output = await withTimeout(
            execution,

            this.timeoutMs,

            `${agentName} timed out after ${this.timeoutMs}ms`,
          );

          return output;
        },
        {
          maxAttempts: this.maxAttempts,

          onRetry: async ({ attempt, error, delay }) => {
            state.addHistory({
              agent: agentName,

              status: "retry",

              attempt,

              delay,

              error: error.message,
            });

            logger.warn("Agent retry", {
              runId: state.get("runId"),

              agent: agentName,

              attempt,

              delay,

              error: error.message,
            });
          },
        },
      );

      const validated = validateAgentResult(result);

      state.addHistory({
        agent: agentName,

        status: validated.success ? "success" : "failure",

        result: validated,
      });

      logger.info("Agent execution completed", {
        runId: state.get("runId"),

        agent: agentName,

        success: validated.success,
      });

      return validated;
    } catch (error) {
      state.addHistory({
        agent: agentName,

        status: "error",

        error: error.message,
      });

      logger.error("Agent execution failed", {
        runId: state.get("runId"),

        agent: agentName,

        error: error.message,
      });

      throw error;
    }
  }
}
