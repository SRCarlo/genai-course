import "dotenv/config";

const groqApiKey = process.env.GROQ_API_KEY;

if (!groqApiKey) {
  throw new Error("GROQ_API_KEY is missing. Add it to your .env file.");
}

export const env = {
  groqApiKey,

  model: process.env.GROQ_MODEL || "openai/gpt-oss-20b",

  port: Number(process.env.PORT) || 3000,
};
