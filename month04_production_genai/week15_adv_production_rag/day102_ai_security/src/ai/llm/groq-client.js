import Groq from "groq-sdk";

export const GROQ_MODEL = process.env.GROQ_MODEL || "openai/gpt-oss-20b";

export const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function generateText(messages) {
  const response = await groq.chat.completions.create({
    model: GROQ_MODEL,
    messages,
    temperature: 0.2,
    max_completion_tokens: 1024,
    include_reasoning: false,
  });

  return response.choices[0]?.message?.content || "";
}
