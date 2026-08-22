import "dotenv/config";

export const env = {
  PORT: Number(process.env.PORT || 5000),

  GROQ_API_KEY: process.env.GROQ_API_KEY,

  GROQ_MODEL:
    process.env.GROQ_MODEL || "openai/gpt-oss-20b",

  USER_REQUESTS_PER_MINUTE:
    Number(process.env.USER_REQUESTS_PER_MINUTE || 10),

  TENANT_REQUESTS_PER_MINUTE:
    Number(process.env.TENANT_REQUESTS_PER_MINUTE || 30),

  MONTHLY_TOKEN_QUOTA:
    Number(process.env.MONTHLY_TOKEN_QUOTA || 100000),

  MAX_PROMPT_LENGTH:
    Number(process.env.MAX_PROMPT_LENGTH || 10000),

  MAX_AGENT_ITERATIONS:
    Number(process.env.MAX_AGENT_ITERATIONS || 8),

  MAX_TOOL_CALLS:
    Number(process.env.MAX_TOOL_CALLS || 10),
};


/**
 * Validate required environment variables.
 */
export function validateEnv() {
  const required = [
    "GROQ_API_KEY",
  ];

  const missing = required.filter(
    (key) => !process.env[key]
  );

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }

  console.log("Environment configuration validated.");
}