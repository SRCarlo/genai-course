import { BaseAgent } from "./base.agent.js";
import { chat } from "../llm/groq.client.js";

function compact(value, maxChars = 12000) {
  if (value == null) {
    return "";
  }

  const text = typeof value === "string" ? value : JSON.stringify(value);

  if (text.length <= maxChars) {
    return text;
  }

  return text.slice(0, maxChars) + "\n...[truncated for review]";
}

export class ReviewerAgent extends BaseAgent {
  constructor() {
    super("reviewer", "Reviews generated code for correctness and security");
  }

  async run(input, state, signal) {
    const code = state.get("code");

    const response = await chat({
      system: `
You are a concise code reviewer.

Review the coding agent's output against the original task.

Check:
1. Correctness
2. Missing requirements
3. Important bugs
4. Security issues
5. Obvious implementation problems

Rules:
- Do not rewrite the entire code.
- Do not repeat the code.
- Do not provide a long tutorial.
- Only report actionable findings.
- If the code is good, say so briefly.
- Keep the review concise.

Return a short review.
`,

      user: `
ORIGINAL TASK:

${compact(input, 4000)}

CODE:

${compact(code, 10000)}

Review the code.
`,

      temperature: 0.1,

      maxCompletionTokens: 1000,

      signal,
    });

    const result = {
      review: response.content,
      usage: response.usage,
    };

    state.set("review", result);

    return result;
  }
}
