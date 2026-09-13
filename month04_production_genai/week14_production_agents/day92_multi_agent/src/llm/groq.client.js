import Groq from "groq-sdk";
import dotenv from "dotenv";

import { withRateLimit } from "./rate-limiter.js";

dotenv.config();

if (!process.env.GROQ_API_KEY) {
  throw new Error("GROQ_API_KEY is missing in .env");
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const MODEL = "openai/gpt-oss-20b";

const MAX_RETRIES = 4;

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function getRetryDelay(error, attempt) {
  const retryAfter =
    error?.headers?.["retry-after"] ?? error?.headers?.get?.("retry-after");

  if (retryAfter) {
    const seconds = Number(retryAfter);

    if (!Number.isNaN(seconds)) {
      return Math.ceil(seconds * 1000) + 500;
    }
  }

  return Math.min(1000 * Math.pow(2, attempt), 10000);
}

function isRateLimitError(error) {
  return (
    error?.status === 429 ||
    error?.code === "rate_limit_exceeded" ||
    String(error?.message).toLowerCase().includes("rate limit")
  );
}

export async function generateText({
  system,
  user,
  temperature = 0.2,
  maxTokens = 500,
}) {
  let lastError;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const completion = await withRateLimit(() =>
        groq.chat.completions.create({
          model: MODEL,

          messages: [
            {
              role: "system",
              content: system,
            },
            {
              role: "user",
              content: user,
            },
          ],

          temperature,

          max_tokens: maxTokens,
        }),
      );

      return completion.choices?.[0]?.message?.content ?? "";
    } catch (error) {
      lastError = error;

      if (!isRateLimitError(error)) {
        throw error;
      }

      if (attempt === MAX_RETRIES) {
        throw error;
      }

      const delay = getRetryDelay(error, attempt);

      console.log(`Groq rate limit reached. ` + `Retrying in ${delay}ms...`);

      await sleep(delay);
    }
  }

  throw lastError;
}
