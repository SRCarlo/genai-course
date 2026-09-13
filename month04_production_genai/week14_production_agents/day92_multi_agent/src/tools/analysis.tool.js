import { generateText } from "../llm/groq.client.js";

export async function analyzeResearch({ task, research }) {
  const system = `
You are an analysis agent.

Analyze research from multiple specialized agents.

Compare the technologies fairly.

Do not invent facts.

Be concise.

Return JSON only.

Required structure:

{
  "comparison": [
    {
      "technology": "...",
      "strengths": ["..."],
      "weaknesses": ["..."],
      "bestFor": ["..."]
    }
  ],
  "recommendation": "...",
  "reasoning": ["..."]
}
`;

  const user = `
Task:
${task}

Research:
${JSON.stringify(research, null, 2)}

Return ONLY valid JSON.
`;

  return generateText({
    system,
    user,
    temperature: 0.1,
    maxTokens: 600,
  });
}
