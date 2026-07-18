import "dotenv/config";

import { ChatGroq } from "@langchain/groq";

const model = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,

  model: "llama-3.3-70b-versatile",

  temperature: 0.7,
});

async function main() {
  const response = await model.invoke("Explain LangChain in simple terms");

  console.log(response.content);
}

main();
