import axios from "axios";

const OLLAMA_URL = "http://localhost:11434/api/generate";

export async function generateResponse(prompt) {
  try {
    const response = await axios.post(OLLAMA_URL, {
      model: "llama3.2:3b",
      prompt,
      stream: false,
    });

    return response.data.response;
  } catch (error) {
    console.error("Ollama Error:", error.message);

    throw new Error("Failed to generate AI response");
  }
}
