import Groq from "groq-sdk";
import "dotenv/config";

const apiKey = process.env.GROQ_API_KEY;
const model = process.env.GROQ_MODEL || "openai/gpt-oss-20b";

export const groq = apiKey ? new Groq({ apiKey }) : null;

export async function generateIncidentAnalysis({ incident, evidence = [] }) {
  if (!groq) {
    throw new Error("GROQ_API_KEY is not configured");
  }

  const response = await groq.chat.completions.create({
    model,
    temperature: 0.2,
    max_completion_tokens: 1200,
    include_reasoning: false,
    messages: [
      {
        role: "system",
        content:
          "You are an AI security incident response assistant. Analyze the supplied incident and evidence. Return concise operational guidance. Do not invent facts. Separate observed facts from recommendations.",
      },
      {
        role: "user",
        content: JSON.stringify(
          {
            incident,
            evidence,
          },
          null,
          2,
        ),
      },
    ],
  });

  return response.choices[0]?.message?.content || "";
}

export { model };
