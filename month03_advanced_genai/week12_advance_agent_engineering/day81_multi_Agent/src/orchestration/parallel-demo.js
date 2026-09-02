import { runParallel } from "./parallel.js";

export async function runCodeAnalysisInParallel({ executor, state, task }) {
  const results = await runParallel(
    executor,

    {
      security: task,

      performance: task,
    },

    state,
  );

  const aggregatedInput = {
    task,

    security: results.security?.data,

    performance: results.performance?.data,
  };

  const final = await executor.execute(
    "aggregator",

    aggregatedInput,

    state,
  );

  return {
    results,

    final,
  };
}
