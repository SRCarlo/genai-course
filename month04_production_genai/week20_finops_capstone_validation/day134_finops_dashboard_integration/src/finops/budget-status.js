"use strict";

function getBudgetStatus({ spent, budget, warningAt = 0.8 }) {
  for (const [name, value] of [
    ["spent", spent],
    ["budget", budget],
    ["warningAt", warningAt],
  ]) {
    if (!Number.isFinite(value) || value < 0) {
      throw new TypeError(`${name} must be a non-negative number`);
    }
  }

  if (budget === 0) {
    return {
      spent,
      budget,
      remaining: 0,
      utilization: null,
      status: spent > 0 ? "over_budget" : "no_budget",
      warning: spent > 0,
    };
  }

  const utilization = spent / budget;

  let status = "healthy";

  if (utilization >= 1) {
    status = "over_budget";
  } else if (utilization >= warningAt) {
    status = "warning";
  }

  return {
    spent,
    budget,
    remaining: Math.max(0, budget - spent),
    utilization: Number((utilization * 100).toFixed(2)),
    status,
    warning: utilization >= warningAt,
  };
}

module.exports = { getBudgetStatus };
