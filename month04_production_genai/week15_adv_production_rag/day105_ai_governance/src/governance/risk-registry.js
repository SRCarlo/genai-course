const risks = [];

export const RISK_CATEGORIES = [
  "DATA_PRIVACY",
  "SECURITY",
  "BIAS",
  "HALLUCINATION",
  "AUTHORIZATION",
  "DATA_LEAKAGE",
  "MODEL_FAILURE",
  "TOOL_ABUSE",
  "RAG_POISONING",
  "AVAILABILITY",
  "COST",
  "COMPLIANCE"
];

export function calculateRiskScore(impact, likelihood) {
  if (!Number.isInteger(impact) || !Number.isInteger(likelihood)) {
    throw new TypeError("Impact and likelihood must be integers.");
  }

  if (impact < 1 || impact > 4 || likelihood < 1 || likelihood > 4) {
    throw new RangeError("Impact and likelihood must be between 1 and 4.");
  }

  return impact * likelihood;
}

export function getRiskLevel(score) {
  if (score >= 13) return "CRITICAL";
  if (score >= 9) return "HIGH";
  if (score >= 4) return "MEDIUM";
  return "LOW";
}

export function registerRisk(risk) {
  const score = risk.score ?? calculateRiskScore(risk.impact, risk.likelihood);
  const level = risk.level ?? getRiskLevel(score);

  const record = {
    ...risk,
    score,
    level,
    createdAt: new Date().toISOString()
  };

  risks.push(record);
  return record;
}

export function getRisks() {
  return [...risks];
}
