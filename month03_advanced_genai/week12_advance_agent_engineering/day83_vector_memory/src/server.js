import "dotenv/config";

import { app } from "./app.js";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Day 83 server running on port ${PORT}`);

  console.log(`Groq model: ${process.env.GROQ_MODEL || "openai/gpt-oss-20b"}`);
});
