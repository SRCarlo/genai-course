import "dotenv/config";
import app from "./app.js";

const PORT = process.env.PORT || 5000;

if (!process.env.GROQ_API_KEY) {
  console.error("ERROR: GROQ_API_KEY is missing.");

  process.exit(1);
}

app.listen(PORT, () => {
  console.log(`Day 76 Agentic RAG server running on port ${PORT}`);

  console.log(`Model: ${process.env.GROQ_MODEL || "openai/gpt-oss-20b"}`);
});
