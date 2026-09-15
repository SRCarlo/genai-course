import "dotenv/config";

export const config = {
  model: process.env.GROQ_MODEL || "openai/gpt-oss-20b",
  logLevel: process.env.LOG_LEVEL || "info",
  inputPricePer1M: Number(process.env.INPUT_PRICE_PER_1M || 0.075),
  outputPricePer1M: Number(process.env.OUTPUT_PRICE_PER_1M || 0.30)
};
