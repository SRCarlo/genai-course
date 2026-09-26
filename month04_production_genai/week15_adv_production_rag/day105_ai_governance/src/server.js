import express from "express";
import { registerAISystem, getAISystems } from "./governance/ai-registry.js";
import {
  registerRisk,
  getRisks,
  calculateRiskScore,
  getRiskLevel,
} from "./governance/risk-registry.js";
import { canProcessData } from "./governance/data-policy.js";
import {
  getApprovalDecision,
  requiresApproval,
} from "./governance/approval.js";

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

// Health check
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Day 105 AI Governance API is running",
  });
});

// Get AI systems
app.get("/api/governance/systems", (req, res) => {
  res.json({
    success: true,
    count: getAISystems().length,
    systems: getAISystems(),
  });
});

// Register AI system
app.post("/api/governance/systems", (req, res) => {
  try {
    const system = registerAISystem(req.body);

    res.status(201).json({
      success: true,
      message: "AI system registered successfully",
      system,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// Calculate risk
app.post("/api/governance/risks/calculate", (req, res) => {
  try {
    const { impact, likelihood } = req.body;

    const score = calculateRiskScore(impact, likelihood);

    const level = getRiskLevel(score);

    res.json({
      success: true,
      impact,
      likelihood,
      score,
      level,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// Register risk
app.post("/api/governance/risks", (req, res) => {
  try {
    const risk = registerRisk(req.body);

    res.status(201).json({
      success: true,
      message: "Risk registered successfully",
      risk,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// Get risks
app.get("/api/governance/risks", (req, res) => {
  res.json({
    success: true,
    count: getRisks().length,
    risks: getRisks(),
  });
});

// Check data policy
app.post("/api/governance/data/check", (req, res) => {
  const { classification } = req.body;

  const allowed = canProcessData(classification);

  res.json({
    success: true,
    classification,
    allowed,
  });
});

// Check approval
app.post("/api/governance/approval/check", (req, res) => {
  const { action } = req.body;

  const decision = getApprovalDecision(action);

  res.json({
    success: true,
    action,
    decision,
    requiresHumanApproval: requiresApproval(action),
  });
});

app.listen(PORT, () => {
  console.log(`Day 105 API running on http://localhost:${PORT}`);
});
