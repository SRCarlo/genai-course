import Groq from "groq-sdk";

export async function askAI(prompt) {
  const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });

  const response = await groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],

    model: "llama-3.3-70b-versatile",
  });

  return response.choices[0].message.content;
}

