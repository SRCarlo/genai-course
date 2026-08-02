import Groq from "groq-sdk";

const getGroqClient = () => {
  return new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });
};

export const generateAIResponse = async (
  systemPrompt,
  userPrompt,
  jsonMode = false,
) => {
  const groq = getGroqClient();

  const request = {
    model: "llama-3.1-8b-instant",
    temperature: 0.3,
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: userPrompt,
      },
    ],
  };

  if (jsonMode) {
    request.response_format = {
      type: "json_object",
    };
  }

  const completion = await groq.chat.completions.create(request);

  const content = completion.choices[0].message.content;

  return jsonMode ? JSON.parse(content) : content;
};
