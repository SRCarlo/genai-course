import Groq from "groq-sdk";

export class AIService {
  constructor({ apiKey, model }) {
    if (!apiKey) {
      throw new Error("GROQ_API_KEY is required.");
    }

    this.model = model;
    this.client = new Groq({ apiKey });
  }

  estimateInputTokens(prompt) {
    return Math.ceil(prompt.length / 4);
  }

  async generate({ prompt }) {
    const start = Date.now();

    const completion = await this.client.chat.completions.create({
      model: this.model,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      reasoning_effort: "medium",
    });

    const usage = completion.usage ?? {};

    const inputTokens = Number(usage.prompt_tokens ?? usage.input_tokens ?? 0);

    const outputTokens = Number(
      usage.completion_tokens ?? usage.output_tokens ?? 0,
    );

    return {
      response: completion.choices?.[0]?.message?.content ?? "",
      model: completion.model ?? this.model,
      usage: {
        inputTokens,
        outputTokens,
        totalTokens:
          Number(usage.total_tokens ?? 0) || inputTokens + outputTokens,
      },
      latencyMs: Date.now() - start,
    };
  }
}
