import axios from "axios";

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || "http://127.0.0.1:11434";

const LLM_MODEL = process.env.LLM_MODEL || "llama3.2:3b";

export async function generateAnswer({ question, context }) {
  const prompt = `
You are a technical knowledge assistant.

Answer the user's question using ONLY the
provided context.

Rules:

1. Do not invent technical information.
2. If the context does not contain enough
   information, say:
   "I don't have enough information in the
   knowledge base to answer that."
3. Give a concise technical explanation.
4. Do not mention information that is not
   supported by the context.

CONTEXT:

${context}

QUESTION:

${question}

ANSWER:
`;

  const response = await axios.post(
    `${OLLAMA_BASE_URL}/api/generate`,
    {
      model: LLM_MODEL,
      prompt,
      stream: false,
      options: {
        temperature: 0.1,
      },
    },
    {
      timeout: 180000,
    },
  );

  return response.data.response?.trim() || "";
}
