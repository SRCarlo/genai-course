import express from "express";
import smartRetriever from "../assignment/smart_retriever.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Smart Retriever API Running",
  });
});

app.post("/retrieve", (req, res) => {
  const { question } = req.body;

  if (!question) {
    return res.status(400).json({
      error: "Question required",
    });
  }

  const results = smartRetriever(question);

  res.json({
    success: true,

    question,

    results,
  });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
