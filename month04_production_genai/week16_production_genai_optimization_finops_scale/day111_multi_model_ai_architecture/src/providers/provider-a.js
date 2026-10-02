import Groq from "groq-sdk";
import { BaseProvider } from "./base-provider.js";

export class ProviderA extends BaseProvider {
  constructor({
    apiKey = process.env.GROQ_API_KEY,
    model = process.env.GROQ_MODEL || "openai/gpt-oss-20b"
  } = {}) {
    super("provider-a");
    this.model = model;
    this.client = apiKey ? new Groq({ apiKey }) : null;
  }

  async generate(request) {
    if (!this.client) {
      throw new Error("GROQ_API_KEY is not configured");
    }

    const messages = [
      {
        role: "system",
        content:
          "You are the Day 111 AI Gateway model. Answer clearly, accurately, and concisely."
      },
      ...(Array.isArray(request.messages)
        ? request.messages
        : [{ role: "user", content: request.prompt || "Hello" }])
    ];

    const startedAt = Date.now();

    const completion = await this.client.chat.completions.create({
      model: this.model,
      messages,
      temperature: request.temperature ?? 0.2,
      max_completion_tokens: request.maxCompletionTokens ?? 1024,
      reasoning_effort: request.reasoningEffort || "medium"
    });

    const choice = completion.choices?.[0];

    return {
      provider: this.name,
      model: this.model,
      text: choice?.message?.content || "",
      usage: completion.usage || null,
      latencyMs: Date.now() - startedAt,
      raw: {
        finishReason: choice?.finish_reason || null
      }
    };
  }
}
