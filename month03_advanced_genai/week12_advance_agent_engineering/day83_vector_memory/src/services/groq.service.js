import Groq from "groq-sdk";

export class GroqService {
  constructor() {
    if (!process.env.GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY is missing");
    }

    this.client = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    this.model = process.env.GROQ_MODEL || "openai/gpt-oss-20b";
  }

  async chat({ system, user, temperature = 0.3 }) {
    const response = await this.client.chat.completions.create({
      model: this.model,

      messages: [
        {
          role: "system",
          content: system,
        },
        {
          role: "user",
          content: user,
        },
      ],

      temperature,

      reasoning_effort: "low",

      max_completion_tokens: 2048,
    });

    return response.choices?.[0]?.message?.content || "";
  }

  async extractMemories(text) {
    const response = await this.client.chat.completions.create({
      model: this.model,

      messages: [
        {
          role: "system",
          content: `
You extract durable user memories from conversation.

Return ONLY valid JSON.

Expected format:
{
  "memories": [
    {
      "type": "preference|fact|event|goal|project|skill|other",
      "content": "short durable memory",
      "importance": 0.0
    }
  ]
}

Rules:
- Only extract information about the user.
- Do not invent facts.
- Do not store temporary conversational filler.
- importance must be between 0 and 1.
- Return an empty memories array if nothing should be remembered.
`,
        },
        {
          role: "user",
          content: text,
        },
      ],

      response_format: {
        type: "json_object",
      },

      temperature: 0,

      reasoning_effort: "low",

      max_completion_tokens: 1000,
    });

    const content = response.choices?.[0]?.message?.content;

    if (!content) {
      return {
        memories: [],
      };
    }

    try {
      return JSON.parse(content);
    } catch {
      return {
        memories: [],
      };
    }
  }
}
