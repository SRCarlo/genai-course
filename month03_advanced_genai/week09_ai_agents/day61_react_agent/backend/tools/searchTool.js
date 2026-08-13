import "dotenv/config";
import Groq from "groq-sdk";

function getGroqClient() {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is missing");
  }

  return new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });
}

export async function searchTool(input) {
  const query = input?.query;

  if (!query || typeof query !== "string") {
    throw new Error("Search requires a query");
  }

  const groq = getGroqClient();

  const response = await groq.chat.completions.create({
    model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",

    messages: [
      {
        role: "system",
        content:
          "You are a research assistant. " +
          "Answer the query accurately and concisely. " +
          "Clearly state when information may be uncertain.",
      },

      {
        role: "user",
        content: query,
      },
    ],

    temperature: 0,

    max_tokens: 1500,
  });

  const result = response.choices?.[0]?.message?.content;

  if (!result) {
    throw new Error("Search returned an empty result");
  }

  return {
    type: "tool_result",

    tool: "search",

    query,

    result,
  };
}
