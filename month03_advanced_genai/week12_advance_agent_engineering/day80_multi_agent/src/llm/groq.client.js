import Groq from "groq-sdk";
import { env } from "../config/env.js";

export const groq = new Groq({
  apiKey: env.groqApiKey
});

export async function chat({
  system,
  user,
  temperature = 0.2,
  maxCompletionTokens = 2000
}) {
  const response = await groq.chat.completions.create({
    model: env.model,

    messages: [
      {
        role: "system",
        content: system
      },
      {
        role: "user",
        content: user
      }
    ],

    temperature,
    max_completion_tokens: maxCompletionTokens
  });

  return {
    content:
      response.choices?.[0]?.message?.content || "",

    usage: response.usage || null,

    model: response.model
  };
}
