import { validateInput } from "../guardrails/inputGuard.js";
import { detectPromptInjection } from "../guardrails/promptGuard.js";

export function securityMiddleware(req, res, next) {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({
      success: false,
      error: "Message is required.",
    });
  }

  if (!validateInput(message)) {
    return res.status(400).json({
      success: false,
      error: "Blocked input detected.",
    });
  }

  if (detectPromptInjection(message)) {
    return res.status(403).json({
      success: false,
      error: "Prompt injection attempt detected.",
    });
  }

  next();
}
