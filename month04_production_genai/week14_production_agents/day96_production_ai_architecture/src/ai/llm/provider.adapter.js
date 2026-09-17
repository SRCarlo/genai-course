import OpenAI from "openai";
import { config } from "../../config/config.js";

const groqClient = new OpenAI({
  apiKey: config.groq.apiKey,
  baseURL: "https://api.groq.com/openai/v1",
});

export const groqProvider = {
  async generate(messages, options = {}) {
    const response = await groqClient.chat.completions.create({
      model: config.groq.model,

      messages,

      temperature: options.temperature ?? 0.2,

      max_tokens: options.maxTokens ?? config.ai.maxTokens,
    });

    const choice = response.choices?.[0];

    return {
      content: choice?.message?.content || "",

      usage: response.usage || {},

      model: response.model || config.groq.model,
    };
  },
};
