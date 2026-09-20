import Groq from "groq-sdk";
const model = process.env.GROQ_MODEL || "openai/gpt-oss-20b";
export class LLMService {
  constructor() {
    if (!process.env.GROQ_API_KEY)
      throw new Error("GROQ_API_KEY is missing. Add it to .env");
    this.client = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  async complete({
    system,
    user,
    temperature = 0.2,
    maxCompletionTokens = 1000,
    responseFormat,
  }) {
    const completion = await this.client.chat.completions.create({
      model,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      temperature,
      max_completion_tokens: maxCompletionTokens,
      include_reasoning: false,
      ...(responseFormat ? { response_format: responseFormat } : {}),
    });
    return completion.choices?.[0]?.message?.content?.trim() || "";
  }
  async completeJSON({ system, user, schema, temperature = 0 }) {
    const content = await this.complete({
      system,
      user,
      temperature,
      maxCompletionTokens: 1200,
      responseFormat: {
        type: "json_schema",
        json_schema: { name: schema.name, strict: true, schema: schema.schema },
      },
    });
    try {
      return JSON.parse(content);
    } catch {
      const match = content.match(/\{[\s\S]*\}/);
      if (!match) throw new Error("Groq returned invalid JSON");
      return JSON.parse(match[0]);
    }
  }
}
