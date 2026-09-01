import { withTimeout } from "./timeout.js";
import { executeWithRetry } from "./retry.js";
import { env } from "../config/env.js";

export async function executeParallel({ executor, agents, task, state }) {
  const jobs = agents.map(async (agentName) => {
    return executeWithRetry(
      () =>
        withTimeout(
          executor.execute(agentName, task, state),
          env.agentTimeoutMs,
        ),

      env.maxRetries,
    );
  });

  return Promise.all(jobs);
}
