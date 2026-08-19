import Groq from "groq-sdk";

import { config } from "../config/env.js";

const groq = new Groq({
  apiKey: config.groqApiKey,
});

export async function generateResponse(message) {
  const completion = await groq.chat.completions.create({
    model: config.groqModel,

    messages: [
      {
        role: "system",
        content:
          "You are a helpful production GenAI assistant. Answer accurately and clearly.",
      },
      {
        role: "user",
        content: message,
      },
    ],

    temperature: 0.2,

    max_completion_tokens: 1024,
  });

  return {
    content: completion.choices[0]?.message?.content || "",

    model: completion.model,

    usage: completion.usage || null,
  };
}
