import Groq from "groq-sdk";
import { config } from "../config/load-config.js";

const groq = new Groq({
  apiKey: config.groqApiKey
});

export async function groqLLM({ message = "Hello AI" } = {}) {
  const startedAt = Date.now();

  const completion = await groq.chat.completions.create({
    model: config.groqModel,
    messages: [
      {
        role: "user",
        content: message
      }
    ],
    temperature: 0.6,
    max_completion_tokens: 512,
    stream: false
  });

  const choice = completion.choices?.[0];
  const usage = completion.usage || {};

  return {
    text: choice?.message?.content || "",
    usage: {
      inputTokens: usage.prompt_tokens ?? 0,
      outputTokens: usage.completion_tokens ?? 0,
      totalTokens: usage.total_tokens ?? 0
    },
    latencyMs: Date.now() - startedAt
  };
}
