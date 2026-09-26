import { registerAISystem, getAISystems } from "./governance/ai-registry.js";
import {
  registerRisk,
  calculateRiskScore,
  getRiskLevel,
  getRisks,
} from "./governance/risk-registry.js";
import { canProcessData } from "./governance/data-policy.js";
import { getRetentionPolicies } from "./governance/retention-policy.js";
import { getApprovalMatrix } from "./governance/approval.js";
import { needsReview } from "./governance/review.js";

registerAISystem({
  systemId: "AI-001",
  name: "Customer Support Assistant",
  purpose: "Customer support Q&A",
  owner: "Engineering",
  team: "AI Platform",
  model: "openai/gpt-oss-20b",
  provider: "Groq",
  version: "v1",
  dataTypes: ["PUBLIC", "INTERNAL"],
  ragEnabled: true,
  toolsEnabled: false,
  riskLevel: "MEDIUM",
  environment: "production",
  status: "ACTIVE",
});

registerRisk({
  riskId: "RISK-001",
  systemId: "AI-001",
  category: "DATA_LEAKAGE",
  impact: 4,
  likelihood: 2,
  mitigation: ["tenant isolation", "authorization", "security testing"],
  status: "MITIGATED",
});

console.log("=== Day 105 AI Governance Demo ===");
console.log("\nAI Systems:", JSON.stringify(getAISystems(), null, 2));
console.log("\nRisks:", JSON.stringify(getRisks(), null, 2));
console.log("\nRisk example:", {
  score: calculateRiskScore(4, 3),
  level: getRiskLevel(12),
});
console.log("\nData policy:", {
  PUBLIC: canProcessData("PUBLIC"),
  INTERNAL: canProcessData("INTERNAL"),
  CONFIDENTIAL: canProcessData("CONFIDENTIAL"),
  RESTRICTED: canProcessData("RESTRICTED"),
});
console.log("\nRetention:", getRetentionPolicies());
console.log("\nApproval matrix:", getApprovalMatrix());
console.log(
  "\nReview required:",
  needsReview(new Date(Date.now() - 100 * 86400000).toISOString()),
);
