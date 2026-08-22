import { env } from "../config/env.js";

export function promptValidation(req, res, next) {
  const { prompt } = req.body;

  if (
    typeof prompt !== "string" ||
    prompt.trim().length === 0
  ) {
    return res.status(400).json({
      error: "invalid_prompt",
      message: "prompt must be a non-empty string"
    });
  }

  if (prompt.length > env.maxPromptLength) {
    return res.status(413).json({
      error: "prompt_too_large",
      message:
        `Prompt exceeds ${env.maxPromptLength} characters`
    });
  }

  next();
}