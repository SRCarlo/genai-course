import Groq from "groq-sdk";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from the project root
dotenv.config({
  path: path.join(__dirname, "../.env"),
});

// Check if API key exists
if (!process.env.GROQ_API_KEY) {
  console.error("GROQ_API_KEY not found.");
  process.exit(1);
}

console.log("API Key Loaded Successfully");

// Create Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function main() {
  try {
    const chat = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: "Explain Generative AI in simple words."
        }
      ]
    });

    console.log("\nAI Response:\n");
    console.log(chat.choices[0].message.content);

  } catch (error) {
    console.error("Error:", error.message);

    if (error.status) {
      console.error("Status Code:", error.status);
    }

    if (error.response) {
      console.error("Response:", error.response.data);
    }
  }
}

main();