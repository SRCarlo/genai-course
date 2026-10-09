import Groq from "groq-sdk";

export class GroqService {
  constructor({ apiKey, model = "openai/gpt-oss-20b" }) {
    if (!apiKey) {
      throw new Error("GROQ_API_KEY_REQUIRED");
    }

    this.client = new Groq({ apiKey });
    this.model = model;
  }

  async answerBillingQuestion(question) {
    if (typeof question !== "string" || !question.trim()) {
      throw new Error("QUESTION_REQUIRED");
    }

    const completion = await this.client.chat.completions.create({
      model: this.model,
      messages: [
        {
          role: "system",
          content: "You are a concise assistant for a SaaS billing demo. Explain billing concepts. Never claim a payment succeeded or change account entitlements."
        },
        { role: "user", content: question.trim() }
      ],
      temperature: 0.2,
      max_completion_tokens: 700
    });

    return completion.choices[0]?.message?.content ?? "";
  }
}
