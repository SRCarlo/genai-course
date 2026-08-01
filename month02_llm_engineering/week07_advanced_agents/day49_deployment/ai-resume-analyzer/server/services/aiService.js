import Groq from "groq-sdk";

export async function analyzeResume(resumeText) {
  const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",

    messages: [
      {
        role: "system",
        content: "You are an expert resume analyzer.",
      },

      {
        role: "user",
        content: `
Analyze this resume.

Give:

1. Resume Summary
2. Skills Found
3. Strengths
4. Weaknesses
5. Improvement Suggestions

Resume:

${resumeText}
`,
      },
    ],
  });

  return response.choices[0].message.content;
}
