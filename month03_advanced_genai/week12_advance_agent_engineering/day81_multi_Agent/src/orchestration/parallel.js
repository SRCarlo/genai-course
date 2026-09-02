export async function runParallel(executor, tasks, state) {
  const entries = Object.entries(tasks);

  const results = await Promise.all(
    entries.map(async ([agentName, input]) => {
      const result = await executor.execute(agentName, input, state);

      return [agentName, result];
    }),
  );

  return Object.fromEntries(results);
}
