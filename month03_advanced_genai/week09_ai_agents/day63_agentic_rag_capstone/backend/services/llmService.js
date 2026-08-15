import "dotenv/config";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const MODEL_NAME =
  process.env.MODEL_NAME || "openai/gpt-oss-20b";

/**
 * Normal LLM call.
 */
export async function callLLM(messages, options = {}) {
  if (!Array.isArray(messages) || messages.length === 0) {
    throw new Error("LLM messages are required");
  }

  const request = {
    model: MODEL_NAME,
    messages,
    temperature: options.temperature ?? 0.2,
    max_tokens: options.max_tokens ?? 1000
  };

  /*
   * Only add tools when the caller actually provides them.
   *
   * This is important because:
   *
   * tool_choice: "none"
   *
   * prevents the model from calling tools.
   */
  if (options.tools?.length) {
    request.tools = options.tools;
    request.tool_choice = options.tool_choice || "auto";
  }

  const response =
    await groq.chat.completions.create(request);

  const message =
    response.choices?.[0]?.message;

  if (!message) {
    throw new Error("LLM returned an empty response");
  }

  return message;
}

/**
 * Alias for compatibility with existing files.
 */
export const chatWithLLM = callLLM;
