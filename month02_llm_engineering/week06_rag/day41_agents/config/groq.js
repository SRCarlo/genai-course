import dotenv from "dotenv";

dotenv.config();

import { ChatGroq } from "@langchain/groq";

const model = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,

  model: "llama-3.3-70b-versatile",

  temperature: 0,
});

export default model;
