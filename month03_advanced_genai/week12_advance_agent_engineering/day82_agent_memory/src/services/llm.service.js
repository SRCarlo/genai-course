import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const MODEL = "openai/gpt-oss-20b";

export async function generateResponse({
  userMessage,
  conversation,
  memoryContext,
}) {
  // Groq only needs role + content for chat messages.
  const cleanConversation = conversation.map(({ role, content }) => ({
    role,
    content,
  }));

  const messages = [
    {
      role: "system",
      content: `
You are a helpful personal AI assistant.

Use the user's memories when they are relevant.

Important rules:
- Answer the user's question directly.
- Do not mention internal memory systems.
- Do not invent memories.
- If a memory is irrelevant, ignore it.
- Keep the response concise and useful.

Relevant user memories:

${memoryContext}
      `.trim(),
    },

    ...cleanConversation,

    {
      role: "user",
      content: userMessage,
    },
  ];

  const completion = await groq.chat.completions.create({
    model: MODEL,
    messages,

    temperature: 0.4,

    max_completion_tokens: 2048,

    reasoning_effort: "low",

    include_reasoning: false,

    stream: false,
  });

  const message = completion.choices?.[0]?.message;

  console.log("Groq assistant message:", message);

  const content = message?.content?.trim();

  if (!content) {
    console.error("Groq returned no assistant content.");

    console.error("Full completion:", JSON.stringify(completion, null, 2));

    return "I was unable to generate a response.";
  }

  return content;
}
