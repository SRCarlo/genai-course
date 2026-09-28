import "dotenv/config";
import Groq from "groq-sdk";

const apiKey = process.env.GROQ_API_KEY;

if (!apiKey) {
  console.warn("GROQ_API_KEY is not set. Real LLM endpoints will fail until .env is configured.");
}

export const GROQ_MODEL = process.env.GROQ_MODEL || "openai/gpt-oss-20b";
export const GROQ_REASONING_EFFORT = process.env.GROQ_REASONING_EFFORT || "low";

export const groq = new Groq({
  apiKey: apiKey || "missing-key"
});

export async function generateText({ messages, maxCompletionTokens = 512 }) {
  return groq.chat.completions.create({
    model: GROQ_MODEL,
    messages,
    max_completion_tokens: maxCompletionTokens,
    reasoning_effort: GROQ_REASONING_EFFORT,
    include_reasoning: false
  });
}

export async function streamText({ messages, maxCompletionTokens = 512 }) {
  return groq.chat.completions.create({
    model: GROQ_MODEL,
    messages,
    max_completion_tokens: maxCompletionTokens,
    reasoning_effort: GROQ_REASONING_EFFORT,
    include_reasoning: false,
    stream: true
  });
}
