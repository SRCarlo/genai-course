export function checkBudget({ currentCost, budget }) {
  if (budget <= 0) {
    return {
      level: "INVALID_BUDGET",
      percentage: 0,
    };
  }

  const percentage = (currentCost / budget) * 100;

  let level = "NORMAL";

  if (percentage >= 100) {
    level = "BUDGET_EXCEEDED";
  } else if (percentage >= 95) {
    level = "CRITICAL";
  } else if (percentage >= 85) {
    level = "HIGH";
  } else if (percentage >= 70) {
    level = "WARNING";
  }

  return {
    level,
    percentage: Number(percentage.toFixed(2)),
    currentCost,
    budget,
    remaining: Number(Math.max(budget - currentCost, 0).toFixed(8)),
  };
}
