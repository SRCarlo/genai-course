import "dotenv/config";

function required(name) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}

export const env = {
  port: Number(process.env.PORT || 5000),

  groqApiKey: required("GROQ_API_KEY"),

  groqModel: process.env.GROQ_MODEL || "openai/gpt-oss-20b",

  jwtSecret: process.env.JWT_SECRET || "development-secret",

  inputTokenPricePerMillion: Number(
    process.env.INPUT_TOKEN_PRICE_PER_MILLION || 0.075,
  ),

  outputTokenPricePerMillion: Number(
    process.env.OUTPUT_TOKEN_PRICE_PER_MILLION || 0.3,
  ),

  defaultMonthlyBudget: Number(process.env.DEFAULT_MONTHLY_BUDGET || 25),
};
