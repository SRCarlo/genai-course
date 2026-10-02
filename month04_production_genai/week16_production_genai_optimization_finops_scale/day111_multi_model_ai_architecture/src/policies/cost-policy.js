export const costRank = {
  low: 1,
  medium: 2,
  high: 3
};

export function isWithinCostBudget(model, maxCostTier = "high") {
  const modelRank = costRank[model.costTier];
  const maxRank = costRank[maxCostTier];

  if (!modelRank || !maxRank) {
    throw new Error("Invalid cost tier");
  }

  return modelRank <= maxRank;
}
