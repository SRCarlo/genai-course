import dotenv from "dotenv";

dotenv.config();

export const outputPolicy = {
  maxLength: Number(process.env.MAX_OUTPUT_LENGTH || 10000),

  blockedPatterns: [
    {
      name: "api_key",
      pattern: /api[_-]?key\s*[:=]\s*\S+/i,
    },
    {
      name: "password",
      pattern: /password\s*[:=]\s*\S+/i,
    },
    {
      name: "secret",
      pattern: /secret\s*[:=]\s*\S+/i,
    },
    {
      name: "private_key",
      pattern: /-----BEGIN\s+(RSA\s+)?PRIVATE\s+KEY-----/i,
    },
  ],
};

export function getOutputPolicy() {
  return outputPolicy;
}
