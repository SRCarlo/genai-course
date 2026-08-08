import axios from "axios";

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || "http://127.0.0.1:11434";

const EMBEDDING_MODEL = process.env.EMBEDDING_MODEL || "nomic-embed-text";

export async function createEmbedding(text) {
  const response = await axios.post(
    `${OLLAMA_BASE_URL}/api/embeddings`,
    {
      model: EMBEDDING_MODEL,
      prompt: text,
    },
    {
      timeout: 120000,
    },
  );

  return response.data.embedding;
}
