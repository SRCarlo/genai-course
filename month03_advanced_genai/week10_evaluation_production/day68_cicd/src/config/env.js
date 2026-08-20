import "dotenv/config";

function getNumber(name, fallback) {
  const value = process.env[name];

  if (value === undefined || value === "") {
    return fallback;
  }

  const parsed = Number(value);

  if (Number.isNaN(parsed)) {
    throw new Error(`${name} must be a number`);
  }

  return parsed;
}

export const env = {
  port: getNumber("PORT", 3000),

  groqApiKey: process.env.GROQ_API_KEY || "",

  groqModel: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",

  useGroqEvaluation: process.env.USE_GROQ_EVALUATION === "true",

  minAccuracy: getNumber("MIN_ACCURACY", 0.9),

  minFaithfulness: getNumber("MIN_FAITHFULNESS", 0.9),
};
