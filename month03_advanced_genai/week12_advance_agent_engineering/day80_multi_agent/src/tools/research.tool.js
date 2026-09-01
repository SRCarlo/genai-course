import { chat } from "../llm/groq.client.js";

export async function researchTopic(topic) {
  const response = await chat({
    system: `
You are a research specialist.

Your job is to research a technical topic.

Return:
1. Key concepts
2. Best practices
3. Security considerations
4. Implementation requirements
5. Important caveats

Do not write production code.
Focus only on research and technical findings.
`,

    user: `
Research the following topic:

${topic}

Return concise but useful technical findings.
`,

    temperature: 0.2,

    maxCompletionTokens: 2500,
  });

  return {
    topic,
    findings: response.content,
    usage: response.usage,
  };
}
