export const performanceBudget = {
  ttftMs: 1500,

  authenticationMs: 100,

  embeddingMs: 500,

  retrievalMs: 500,

  rerankingMs: 500,

  llmMs: 2500,

  toolMs: 1000,

  totalMs: 5000,
};

export function checkBudget(stage, durationMs) {
  const key = `${stage}Ms`;
  const budgetMs = performanceBudget[key];

  if (budgetMs === undefined) {
    return {
      stage,
      durationMs,
      budgetMs: null,
      exceeded: false,
    };
  }

  return {
    stage,
    durationMs,
    budgetMs,
    exceeded: durationMs > budgetMs,
  };
}

export function checkAllBudgets(measurements) {
  return Object.entries(measurements).map(([stage, durationMs]) =>
    checkBudget(stage, durationMs),
  );
}
