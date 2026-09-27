import "dotenv/config";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const MODEL = process.env.GROQ_MODEL || "openai/gpt-oss-20b";

export async function generateWithGroq({
  message,
  systemPrompt,
  temperature = 0.2,
  maxTokens = 500,
}) {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is missing in .env");
  }

  const messages = [];

  if (systemPrompt) {
    messages.push({
      role: "system",
      content: systemPrompt,
    });
  }

  messages.push({
    role: "user",
    content: message,
  });

  const completion = await groq.chat.completions.create({
    model: MODEL,
    messages,
    temperature,
    max_tokens: maxTokens,
  });

  const choice = completion.choices?.[0];

  const usage = completion.usage || {};

  return {
    model: completion.model || MODEL,

    message: choice?.message?.content || "",

    usage: {
      promptTokens: usage.prompt_tokens || 0,

      completionTokens: usage.completion_tokens || 0,

      totalTokens: usage.total_tokens || 0,
    },
  };
}
