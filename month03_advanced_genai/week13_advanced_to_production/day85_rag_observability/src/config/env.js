import "dotenv/config";

function required(name) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export const env = {
  port: Number(process.env.PORT || 3000),

  groqApiKey: required("GROQ_API_KEY"),

  groqModel:
    process.env.GROQ_MODEL || "openai/gpt-oss-20b",

  inputPricePerMillion: Number(
    process.env.INPUT_PRICE_PER_MILLION || 0.075
  ),

  outputPricePerMillion: Number(
    process.env.OUTPUT_PRICE_PER_MILLION || 0.30
  ),

  topK: Number(process.env.RAG_TOP_K || 5),

  rerankK: Number(
    process.env.RAG_RERANK_K || 3
  ),

  logLevel:
    process.env.LOG_LEVEL || "info"
};