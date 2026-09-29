import Groq from "groq-sdk";
import "dotenv/config";

export class LLMService {
  constructor() {
    if (!process.env.GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY is missing in .env");
    }

    this.client = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    this.model = process.env.GROQ_MODEL || "openai/gpt-oss-20b";
  }

  async generate({ messages, temperature = 0.2 }) {
    const completion = await this.client.chat.completions.create({
      model: this.model,
      messages,
      temperature,
    });

    const response = completion.choices?.[0]?.message?.content || "";

    return {
      response,
      model: this.model,
    };
  }
}
