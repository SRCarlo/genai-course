import dotenv from "dotenv";

dotenv.config();

export const env = {
  groqApiKey: process.env.GROQ_API_KEY,
  model: process.env.GROQ_MODEL || "openai/gpt-oss-20b",

  port: Number(process.env.PORT || 3000),

  maxSteps: Number(process.env.MAX_STEPS || 10),

  maxRetries: Number(process.env.MAX_RETRIES || 2),

  agentTimeoutMs: Number(process.env.AGENT_TIMEOUT_MS || 30000),
};

if (!env.groqApiKey) {
  console.warn("WARNING: GROQ_API_KEY is not configured.");
}
