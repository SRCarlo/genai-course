import "dotenv/config";

export const config = {
  port: Number(process.env.PORT || 3000),
  model: process.env.MODEL_NAME || "openai/gpt-oss-20b",
  groqApiKey: process.env.GROQ_API_KEY || "",
  reasoningEffort: process.env.GROQ_REASONING_EFFORT || "medium",
  maxCompletionTokens: Number(process.env.GROQ_MAX_COMPLETION_TOKENS || 800),
  nodeEnv: process.env.NODE_ENV || "development"
};

export function assertConfig() {
  if (!config.groqApiKey) {
    console.warn(
      "[config] GROQ_API_KEY is not set. The app will use a deterministic fallback response."
    );
  }
}
