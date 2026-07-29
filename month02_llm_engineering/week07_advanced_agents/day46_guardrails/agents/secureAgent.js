import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config();

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export async function askAI(message) {
    const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
            {
                role: "system",
                content: "You are a secure AI assistant."
            },
            {
                role: "user",
                content: message
            }
        ]
    });

    return completion.choices[0].message.content;
}