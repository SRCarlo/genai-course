import Groq from "groq-sdk";
import { config } from "../../config/config.js";

export class LLMService {
  constructor() {
    if (!config.groqApiKey) {
      throw new Error("GROQ_API_KEY_MISSING");
    }

    this.client = new Groq({
      apiKey: config.groqApiKey,
    });

    this.model = config.llmModel;
  }

  async generate({ question, context }) {
    if (!question) {
      throw new Error("QUESTION_EMPTY");
    }

    if (!context) {
      throw new Error("CONTEXT_EMPTY");
    }

    const completion = await this.client.chat.completions.create({
      model: this.model,

      temperature: 0.2,

      messages: [
        {
          role: "system",
          content: `
You are a reliable company knowledge assistant.

Answer the user's question using ONLY the
provided context.

Rules:

1. Do not invent facts.
2. Do not use outside knowledge.
3. If the context does not contain enough
   information, say:

"I don't have enough information to answer that."

4. Keep the answer clear and concise.
5. Do not claim that you accessed documents
   that are not present in the context.
`,
        },

        {
          role: "user",
          content: `
Context:

${context}

Question:

${question}
`,
        },
      ],
    });

    const answer = completion.choices?.[0]?.message?.content;

    if (!answer) {
      throw new Error("LLM_EMPTY_RESPONSE");
    }

    return answer.trim();
  }
}
