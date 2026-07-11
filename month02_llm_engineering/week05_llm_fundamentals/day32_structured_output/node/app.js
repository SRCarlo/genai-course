import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config({
    path: "../.env"
});

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function run() {
  const prompt = `
Return ONLY valid JSON.

{
    "name":"",
    "category":"",
    "use_cases":[]
}

Topic: Express.js
`;

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",

    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  console.log(response.choices[0].message.content);
}

run();
