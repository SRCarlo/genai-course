import express from "express";
import dotenv from "dotenv";

import { validateInput } from "./security/inputValidator.js";
import {
  detectPromptInjection,
  protectSystemPromptRequest,
  safeSystemPromptResponse,
} from "./security/promptGuard.js";
import { validateOutput } from "./security/outputValidator.js";
import { redactPII } from "./security/piiRedactor.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "10kb" }));

app.get("/", (req, res) => {
  res.json({
    message: "Day 66 AI Security API is running",
  });
});

app.post("/api/chat", (req, res) => {
  const { question } = req.body;

  // 1. Input validation
  const input = validateInput(question);

  if (!input.valid) {
    return res.status(400).json({
      error: input.reason,
    });
  }

  // 2. Prompt injection detection
  const injection = detectPromptInjection(input.value);

  if (injection.suspicious) {
    return res.status(400).json({
      error: "Suspicious prompt detected",
    });
  }

  // 3. System prompt protection
  if (protectSystemPromptRequest(input.value)) {
    return res.status(403).json({
      response: safeSystemPromptResponse(),
    });
  }

  // 4. Simple response for testing
  const response = `You asked: ${input.value}`;

  // 5. Output validation
  const output = validateOutput(response);

  if (!output.valid) {
    return res.status(500).json({
      error: "Unsafe output blocked",
    });
  }

  // 6. Basic PII/secret redaction
  const safeResponse = redactPII(output.output);

  return res.json({
    response: safeResponse,
  });
});

app.use((err, req, res, next) => {
  res.status(500).json({
    error: "Internal server error",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
