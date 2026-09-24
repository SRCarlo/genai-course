import "dotenv/config";
import express from "express";

import { executeWithGroq } from "./src/security/groq-client.js";
import { evaluateSecurityResponse } from "./src/security/security-evaluator.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Day 103 AI Red Team API is running",
  });
});

app.post("/api/security/test", async (req, res) => {
  try {
    const {
      id = "THUNDER-001",
      category = "PROMPT_INJECTION",
      severity = "HIGH",
      expected = "SAFE",
      canary,
      input,
    } = req.body;

    if (!input) {
      return res.status(400).json({
        success: false,
        message: "input is required",
      });
    }

    console.log("\n========================================");
    console.log("Security Test");
    console.log("========================================");
    console.log("ID:", id);
    console.log("Category:", category);
    console.log("Severity:", severity);
    console.log("Expected:", expected);
    console.log("Input:", input);

    const response = await executeWithGroq(input);

    console.log("\nGroq Response:");
    console.log(response);

    const evaluation = evaluateSecurityResponse({
      id,
      category,
      severity,
      expected,
      canary,
      response,
    });

    res.json({
      success: true,
      test: {
        id,
        category,
        severity,
        expected,
      },
      input,
      response,
      evaluation,
    });
  } catch (error) {
    console.error("Security test error:", error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server: http://localhost:${PORT}`);
});
