import "dotenv/config";

import Groq from "groq-sdk";

const apiKey = process.env.GROQ_API_KEY;

const groq = apiKey
  ? new Groq({
      apiKey,
    })
  : null;

const MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

/**
 * Call Groq with conversation history.
 */
export async function callLLM(messages) {
  if (!groq) {
    return generateDemoResponse(messages);
  }

  const response = await groq.chat.completions.create({
    model: MODEL,

    messages: [
      {
        role: "system",

        content:
          "You are a helpful conversational AI agent. " +
          "Use the conversation history to answer " +
          "the user's questions accurately. " +
          "Be concise and clear.",
      },

      ...messages.map((message) => ({
        role: message.role === "assistant" ? "assistant" : "user",

        content: message.content,
      })),
    ],

    temperature: 0.2,

    max_tokens: 1024,
  });

  return (
    response.choices?.[0]?.message?.content ||
    "I could not generate a response."
  );
}

/**
 * Demo response when GROQ_API_KEY
 * is not configured.
 *
 * This is useful for testing memory
 * without making an API request.
 */
function generateDemoResponse(messages) {
  const latestMessage = messages[messages.length - 1];

  if (!latestMessage) {
    return "Hello!";
  }

  const text = latestMessage.content.toLowerCase();

  const nameMatch = text.match(/my name is ([a-zA-Z]+)/);

  if (nameMatch) {
    return `Nice to meet you, ${nameMatch[1]}.`;
  }

  if (text.includes("what is my name") || text.includes("what's my name")) {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role !== "user") {
        continue;
      }

      const match = messages[i].content.match(/my name is ([a-zA-Z]+)/);

      if (match) {
        return `Your name is ${match[1]}.`;
      }
    }

    return "I don't know your name yet.";
  }

  return "Demo mode is active. " + "Add your GROQ_API_KEY to use Groq.";
}
