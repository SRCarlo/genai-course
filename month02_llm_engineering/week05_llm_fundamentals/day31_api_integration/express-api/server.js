import express from "express";
import dotenv from "dotenv";
import Groq from "groq-sdk";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from project root
dotenv.config({
  path: path.join(__dirname, "../.env"),
});

const app = express();

app.use(express.json());

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Health Check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Server is running"
  });
});

// Chat Endpoint
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required"
      });
    }

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: message
        }
      ]
    });

    res.status(200).json({
      success: true,
      reply: response.choices[0].message.content
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});