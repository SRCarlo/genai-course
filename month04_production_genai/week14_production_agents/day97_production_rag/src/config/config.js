import "dotenv/config";

export const config = {
  port: Number(process.env.PORT || 3000),

  groqApiKey: process.env.GROQ_API_KEY,

  llmModel: process.env.LLM_MODEL || "openai/gpt-oss-20b",

  embeddingModel: process.env.EMBEDDING_MODEL || "fake-embedding-model",

  topK: Number(process.env.TOP_K || 5),

  similarityThreshold: Number(process.env.SIMILARITY_THRESHOLD || 0.1),
};
