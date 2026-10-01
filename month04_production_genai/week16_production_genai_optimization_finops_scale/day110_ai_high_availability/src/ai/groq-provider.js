import Groq from "groq-sdk";
import { config } from "../config/config.js";
export class GroqProvider {
  constructor({ apiKey = config.groqApiKey, model = config.groqModel } = {}) {
    if (!apiKey) throw new Error("GROQ_API_KEY is missing");
    this.client = new Groq({ apiKey });
    this.model = model;
  }
  async generate(input) {
    const completion = await this.client.chat.completions.create({
      model: this.model,
      messages: [{ role: "user", content: input }],
      temperature: 0.6,
      max_completion_tokens: 2048,
    });
    return {
      text: completion.choices?.[0]?.message?.content || "",
      model: this.model,
      usage: completion.usage || null,
    };
  }
}
