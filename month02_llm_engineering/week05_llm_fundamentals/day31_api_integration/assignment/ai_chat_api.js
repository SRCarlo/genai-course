import express from "express";
import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config();

const app = express();

app.use(express.json());

// Simple request logging middleware
app.use((req, res, next) => {
  console.log(
    `[${new Date().toLocaleString()}] ${req.method} ${req.url}`
  );
  next();
});

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Health Route
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running"
  });
});

// Chat Route
app.post("/chat", async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required."
      });
    }

    const messages = [
      {
        role: "system",
        content: "You are a helpful AI assistant."
      },
      ...history,
      {
        role: "user",
        content: message
      }
    ];

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages
    });

    res.status(200).json({
      success: true,
      reply: response.choices[0].message.content
    });

  } catch (error) {
    console.error("Groq API Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
});

// 404 Route
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});