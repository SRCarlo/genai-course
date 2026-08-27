import "dotenv/config";

import app from "./app.js";

import { initializeVectorIndex } from "./services/vector.service.js";

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await initializeVectorIndex();

    app.listen(PORT, () => {
      console.log(`Day 75 RAG server running on http://localhost:${PORT}`);

      console.log(`Model: ${process.env.GROQ_MODEL || "openai/gpt-oss-20b"}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);

    process.exit(1);
  }
}

startServer();
