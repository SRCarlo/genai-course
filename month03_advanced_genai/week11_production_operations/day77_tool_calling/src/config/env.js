import "dotenv/config";

const requiredEnv = ["GROQ_API_KEY"];

for (const key of requiredEnv) {
  if (!process.env[key]) {
    throw new Error(`Missing environment variable: ${key}`);
  }
}

export const env = {
  groqApiKey: process.env.GROQ_API_KEY,
  groqModel: process.env.GROQ_MODEL || "openai/gpt-oss-20b",
  port: Number(process.env.PORT || 3000),
};
