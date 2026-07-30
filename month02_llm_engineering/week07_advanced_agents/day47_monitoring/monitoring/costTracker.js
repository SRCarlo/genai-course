import dotenv from "dotenv";

dotenv.config();

let totalCost = 0;

export function calculateCost(tokens) {
  const cost = tokens * Number(process.env.TOKEN_COST);

  totalCost += cost;

  return cost;
}

export function getCostMetrics() {
  return {
    totalCost,
  };
}
