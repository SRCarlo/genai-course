import "dotenv/config";
export const config = {
  port: Number(process.env.PORT || 3000),
  groqApiKey: process.env.GROQ_API_KEY,
  groqModel: process.env.GROQ_MODEL || "openai/gpt-oss-20b",
  aiTimeoutMs: Number(process.env.AI_TIMEOUT_MS) || 30000,
  retryCount: Number(process.env.RETRY_COUNT) || 3,
  retryBaseDelay: Number(process.env.RETRY_BASE_DELAY) || 200,
  circuitFailureThreshold: Number(process.env.CIRCUIT_FAILURE_THRESHOLD) || 3,
  circuitResetTimeout: Number(process.env.CIRCUIT_RESET_TIMEOUT) || 5000,
};
export function validateConfig() {
  if (!config.groqApiKey)
    console.warn("WARNING: GROQ_API_KEY is not configured.");
}
