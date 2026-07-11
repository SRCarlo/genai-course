import dotenv from "dotenv";

dotenv.config({
  path: "../.env",
});

import express from "express";
import Groq from "groq-sdk";
import studentRouter from "./routes/student.js";

const app = express();

app.use(express.json());

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

app.use("/student", studentRouter(groq));

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
