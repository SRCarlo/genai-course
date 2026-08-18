import express from "express";
import dotenv from "dotenv";

import { securityMiddleware } from "./middleware/securityMiddleware.js";
import { validateOutput } from "./security/outputValidator.js";
import { redactPII } from "./security/piiRedactor.js";
import { safeSystemPromptResponse } from "./security/promptGuard.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "10kb" }));

app.get("/", (req, res) => {
  res.json({
    message: "Day 66 AI Security API is running",
  });
});

app.post("/api/chat", securityMiddleware, (req, res) => {
  const question = req.safeQuestion;

  const response = `You asked: ${question}`;

  const output = validateOutput(response);

  if (!output.valid) {
    return res.status(500).json({
      error: "Unsafe output blocked",
    });
  }

  const safeResponse = redactPII(output.output);

  return res.json({
    response: safeResponse,
    requestId: req.requestId,
    traceId: req.traceId,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
