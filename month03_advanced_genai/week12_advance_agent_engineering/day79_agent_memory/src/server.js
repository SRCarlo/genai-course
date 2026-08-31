import dotenv from "dotenv";

dotenv.config();

import { createApp } from "./app.js";

const PORT = process.env.PORT || 5000;

const app = createApp();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);

  console.log(`Model: ${process.env.GROQ_MODEL || "openai/gpt-oss-20b"}`);
});
