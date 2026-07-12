import express from "express";
import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config();

const app = express();
app.use(express.json());

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const messages = [
  {
    role: "system",
    content: "You are an AI mentor.",
  },
];

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        error: "Message is required",
      });
    }

    messages.push({
      role: "user",
      content: message,
    });

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages,
    });

    const reply = response.choices[0].message.content;

    messages.push({
      role: "assistant",
      content: reply,
    });

    res.json({
      reply,
      totalMessages: messages.length,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
