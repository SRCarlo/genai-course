import Groq from "groq-sdk";

const MODEL = process.env.GROQ_MODEL || "openai/gpt-oss-20b";

let client;

function getClient() {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY_NOT_CONFIGURED");
  }

  client ??= new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });

  return client;
}

export async function generateBillingExplanation(prompt) {
  const response = await getClient().chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: "system",
        content:
          "You explain SaaS billing concepts clearly and concisely. Do not invent prices or payment provider facts.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    reasoning_effort: "low",
    max_completion_tokens: 800,
  });

  return response.choices[0]?.message?.content ?? "";
}
