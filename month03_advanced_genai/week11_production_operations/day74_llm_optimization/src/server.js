import dotenv from "dotenv";
import app from "./app.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Day 74 server running on http://localhost:${PORT}`);

  console.log(`Groq model: ${process.env.GROQ_MODEL || "openai/gpt-oss-20b"}`);
});
