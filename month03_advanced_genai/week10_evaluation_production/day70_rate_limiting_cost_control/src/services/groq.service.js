import Groq from "groq-sdk";
import { env } from "../config/env.js";

const groq = new Groq({
  apiKey: env.GROQ_API_KEY,
});

export async function generateChat({
  prompt,
  model = env.GROQ_MODEL,
  maxOutputTokens = 512,
}) {
  const completion = await groq.chat.completions.create({
    model,

    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],

    temperature: 0.2,

    max_completion_tokens: maxOutputTokens,
  });

  const usage = completion.usage ?? {};

  return {
    text: completion.choices?.[0]?.message?.content ?? "",

    model: completion.model,

    usage: {
      inputTokens: usage.prompt_tokens ?? 0,

      outputTokens: usage.completion_tokens ?? 0,

      totalTokens: usage.total_tokens ?? 0,
    },
  };
}
