import Groq from "groq-sdk";

export const DEFAULT_GROQ_MODEL = "openai/gpt-oss-20b";

export class AIService {
  constructor({
    apiKey = process.env.GROQ_API_KEY,
    model = process.env.GROQ_MODEL || DEFAULT_GROQ_MODEL,
    client = null,
  } = {}) {
    this.model = model;
    this.client = client ?? (apiKey ? new Groq({ apiKey }) : null);
  }

  async generate({ user, tenant, prompt }) {
    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      const error = new Error("prompt is required");
      error.statusCode = 400;
      throw error;
    }

    if (!this.client) {
      const error = new Error("GROQ_API_KEY is not configured");
      error.statusCode = 503;
      throw error;
    }

    const completion = await this.client.chat.completions.create({
      model: this.model,
      messages: [
        {
          role: "system",
          content: `You are the AI assistant for ${tenant.name}. Respect the application's authorization boundaries. Do not claim access to tools or data that the application has not provided.`,
        },
        { role: "user", content: prompt.trim() },
      ],
      reasoning_effort: "medium",
      temperature: 0.2,
      max_completion_tokens: 2048,
    });

    return {
      tenantId: tenant.id,
      userId: user.id,
      model: completion.model,
      response: completion.choices[0]?.message?.content ?? "",
      prompt: prompt.trim(),
    };
  }
}
