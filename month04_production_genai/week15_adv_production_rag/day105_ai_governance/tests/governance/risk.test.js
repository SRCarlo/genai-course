import test from "node:test";
import assert from "node:assert/strict";
import {
  calculateRiskScore,
  getRiskLevel,
  registerRisk
} from "../../src/governance/risk-registry.js";

test("calculates risk score", () => {
  assert.equal(calculateRiskScore(4, 3), 12);
});

test("maps score to project risk level", () => {
  assert.equal(getRiskLevel(2), "LOW");
  assert.equal(getRiskLevel(8), "MEDIUM");
  assert.equal(getRiskLevel(12), "HIGH");
  assert.equal(getRiskLevel(16), "CRITICAL");
});

test("registers a risk with calculated score and level", () => {
  const risk = registerRisk({
    riskId: "TEST-RISK-001",
    systemId: "TEST-AI-001",
    category: "SECURITY",
    impact: 4,
    likelihood: 2
  });

  assert.equal(risk.score, 8);
  assert.equal(risk.level, "MEDIUM");
});
