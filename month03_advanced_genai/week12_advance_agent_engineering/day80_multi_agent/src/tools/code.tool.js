import { chat } from "../llm/groq.client.js";

export async function generateCode({ task, research }) {
  const response = await chat({
    system: `
You are a senior Node.js developer.

Your responsibility is implementation.

Generate production-oriented Node.js code
based on the provided research.

Requirements:

- Use modern JavaScript
- Prefer ES modules
- Validate inputs
- Handle errors
- Follow security best practices
- Do not invent unsupported requirements
- Explain important implementation decisions
`,

    user: `
TASK:

${task}

RESEARCH:

${research}

Generate the implementation.

Return:

1. Architecture
2. Files
3. Code
4. Explanation
5. Security considerations
`,

    temperature: 0.15,

    maxCompletionTokens: 5000,
  });

  return {
    implementation: response.content,
    usage: response.usage,
  };
}
