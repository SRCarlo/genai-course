import "dotenv/config";
import Groq from "groq-sdk";

const apiKey = process.env.GROQ_API_KEY;
const model = process.env.GROQ_MODEL || "openai/gpt-oss-20b";

export function createGroqClient() {
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is missing. Add it to your .env file.");
  }

  return new Groq({ apiKey });
}

export async function askGroq(prompt, options = {}) {
  const client = createGroqClient();

  const completion = await client.chat.completions.create({
    model,
    messages: [
      {
        role: "system",
        content:
          options.systemPrompt ||
          "You are a production AI assistant operating under strict governance controls. Do not request or expose secrets."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: options.temperature ?? 0.2,
    max_tokens: options.maxTokens ?? 500
  });

  return completion.choices?.[0]?.message?.content ?? "";
}
