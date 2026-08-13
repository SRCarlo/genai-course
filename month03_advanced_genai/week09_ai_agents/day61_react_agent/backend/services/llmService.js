import "dotenv/config";
import Groq from "groq-sdk";

function getGroqClient() {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is missing. Add it to backend/.env");
  }

  return new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });
}

export async function askLLM({ systemPrompt, userPrompt }) {
  const groq = getGroqClient();

  const model = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

  const response = await groq.chat.completions.create({
    model,

    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: userPrompt,
      },
    ],

    temperature: 0,

    response_format: {
      type: "json_object",
    },

    max_tokens: 1000,
  });

  const content = response.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("Groq returned an empty response");
  }

  return content;
}
