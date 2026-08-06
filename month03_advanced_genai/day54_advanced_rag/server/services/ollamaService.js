import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export async function askOllama(question, context) {
  const prompt = `
You are a helpful technical assistant.

Answer ONLY using the supplied context.

If the answer is not present, say:

"I don't have enough information."

Context:

${context}

Question:

${question}
`;

  const response = await axios.post(`${process.env.OLLAMA_URL}/api/generate`, {
    model: process.env.MODEL,
    prompt,
    stream: false,
  });

  return response.data.response;
}
