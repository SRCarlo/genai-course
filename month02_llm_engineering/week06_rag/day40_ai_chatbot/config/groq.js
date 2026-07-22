import dotenv from "dotenv";
import { ChatGroq } from "@langchain/groq";

dotenv.config();

const model = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,

  model: "llama-3.3-70b-versatile",

  temperature: 0.5,
});

export default model;
