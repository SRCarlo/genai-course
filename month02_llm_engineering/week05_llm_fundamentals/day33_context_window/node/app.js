import Groq from "groq-sdk";
import dotenv from "dotenv";
import { log } from "node:console";

dotenv.config({
    path:"../.env"
});

const groq = new Groq({
  apikey: process.env.GROQ_API_KEY,
});

const messages = [
  {
    role: "system",
    content: "You are a helpful AI mentor.",
  },
];

async function chat(userMessages) {
  messages.push({
    role: "user",
    content: userMessages,
  });

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",

    messages,
  });

  const replay = response.choices[0].message.content;

  messages.push({
    role: "assistant",

    content: replay,
  });

  console.log(replay);
}

await chat("My name is Shubham.");
await chat("What is my name?");
