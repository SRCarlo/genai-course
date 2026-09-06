import Groq from "groq-sdk";
import { env } from "../config/env.js";

export class GroqClient {
  constructor() {
    this.client = new Groq({
      apiKey: env.groqApiKey,
    });

    this.model = env.groqModel;
  }

  async generate({ question, context }) {
    const completion = await this.client.chat.completions.create({
      model: this.model,

      messages: [
        {
          role: "system",
          content: `
You are a production RAG assistant.

Answer the user's question using ONLY the supplied context.

Rules:
1. Do not invent facts.
2. If the context does not contain enough information,
   say that you do not have enough information.
3. Keep the answer concise.
4. Cite the source document IDs used in the answer.
5. Do not mention internal reasoning.
`,
        },
        {
          role: "user",
          content: `
Question:
${question}

Context:
${context}
`,
        },
      ],

      temperature: 0.2,

      max_completion_tokens: 700,

      reasoning_effort: "low",
    });

    const message = completion.choices?.[0]?.message;

    return {
      answer: message?.content || "",

      model: completion.model,

      usage: {
        inputTokens: completion.usage?.prompt_tokens || 0,

        outputTokens: completion.usage?.completion_tokens || 0,

        totalTokens: completion.usage?.total_tokens || 0,
      },

      raw: completion,
    };
  }
}
