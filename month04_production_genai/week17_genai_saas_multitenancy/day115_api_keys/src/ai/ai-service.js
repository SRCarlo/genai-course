import Groq from "groq-sdk";
import { requireEnv } from "../security/secret-validator.js";

const groq = new Groq({
  apiKey: requireEnv("GROQ_API_KEY")
});

const model = process.env.GROQ_MODEL || "openai/gpt-oss-20b";

export async function generateChatResponse(message) {
  const completion = await groq.chat.completions.create({
    model,
    messages: [
      {
        role: "system",
        content:
          "You are the AI assistant inside a secure multi-tenant GenAI SaaS. Never ask for or expose API keys, tokens, passwords, or other secrets."
      },
      {
        role: "user",
        content: message
      }
    ],
    reasoning_effort: "medium"
  });

  return {
    model: completion.model,
    response: completion.choices[0]?.message?.content ?? "",
    usage: completion.usage ?? null
  };
}
