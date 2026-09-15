import Groq from "groq-sdk";
import { config } from "../config/observability.js";

if (!process.env.GROQ_API_KEY) {
  throw new Error("GROQ_API_KEY is missing. Add it to .env");
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

export async function callGroq(messages, options = {}) {
  return groq.chat.completions.create({
    model: config.model,
    messages,
    temperature: options.temperature ?? 0.2,
    max_completion_tokens: options.maxCompletionTokens ?? 700,
    include_reasoning: false
  });
}
