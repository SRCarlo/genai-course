import Groq from "groq-sdk";
import { config } from "../../config/config.js";

const groq = new Groq({
  apiKey: config.GROQ_API_KEY
});

export class LlmService {
  async generate({ question, context }) {
    const response = await groq.chat.completions.create({
      model: config.GROQ_MODEL,
      reasoning_effort: "medium",
      messages: [
        {
          role: "system",
          content:
            "You are a RAG assistant. Answer only from the supplied context. " +
            "If the context does not contain enough information, say you do not have enough information. " +
            "Do not invent facts."
        },
        {
          role: "user",
          content: `Context:\n${context}\n\nQuestion:\n${question}`
        }
      ],
      temperature: 0.2,
      max_completion_tokens: 1200
    });

    return response.choices[0]?.message?.content?.trim() ||
      "I don't have enough information to answer that.";
  }
}
