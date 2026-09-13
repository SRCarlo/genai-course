import { generateText } from "../llm/groq.client.js";

export async function researchTopic({ topic, focus }) {
  const system = `
You are a specialized technology research agent.

Research ONLY the requested technology.

Be concise.

Do not write long explanations.

Return JSON only.

Required fields:

{
  "technology": "...",
  "summary": "...",
  "architecture": "...",
  "ecosystem": "...",
  "performance": "...",
  "aiIntegration": "...",
  "developerExperience": "...",
  "productionSuitability": "..."
}

Each field should contain concise information.
`;

  const user = `
Technology:
${topic}

Research task:
${focus}

Return ONLY valid JSON.
`;

  return generateText({
    system,
    user,
    temperature: 0.1,
    maxTokens: 500,
  });
}
