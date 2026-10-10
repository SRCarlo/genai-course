import Groq from "groq-sdk";

export class GroqChatAdapter {
  constructor({
    apiKey = process.env.GROQ_API_KEY,
    model = process.env.GROQ_MODEL || "openai/gpt-oss-20b",
    client
  } = {}) {
    this.model = model;
    this.client = client ?? (apiKey ? new Groq({ apiKey }) : null);
  }

  async generate({ question }) {
    if (!this.client) {
      throw new Error("GROQ_API_KEY_MISSING");
    }

    const completion = await this.client.chat.completions.create({
      model: this.model,
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant. Do not claim to access private tenant data unless it was provided in this request."
        },
        { role: "user", content: question }
      ],
      temperature: 0.2,
      max_tokens: 1024
    });

    const answer = completion.choices?.[0]?.message?.content;
    if (typeof answer !== "string" || !answer.trim()) {
      throw new Error("EMPTY_MODEL_RESPONSE");
    }

    return {
      answer: answer.trim(),
      usage: {
        inputTokens: completion.usage?.prompt_tokens ?? 0,
        outputTokens: completion.usage?.completion_tokens ?? 0
      }
    };
  }
}
