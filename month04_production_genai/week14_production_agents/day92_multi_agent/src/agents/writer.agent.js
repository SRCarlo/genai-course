import { BaseAgent } from "./base.agent.js";

import { generateText } from "../llm/groq.client.js";

export class WriterAgent extends BaseAgent {
  constructor() {
    super({
      name: "writer-agent",

      role: "Create the final user-facing answer",

      tools: [],

      permissions: ["write"],
    });
  }

  async execute(input) {
    try {
      const system = `
You are the final writer agent.

Create a clear professional answer.

Use ONLY the supplied research,
analysis and review.

Do not invent facts.

Keep the response concise.

Use:

# Executive Summary

## Comparison

| Technology | Strengths | Weaknesses | Best For |
|---|---|---|---|

## Recommendation

## Conclusion

Return Markdown.
`;

      const user = `
Task:
${input.task}

Research:
${JSON.stringify(input.research, null, 2)}

Analysis:
${JSON.stringify(input.analysis, null, 2)}

Review:
${JSON.stringify(input.review, null, 2)}
`;

      const draft = await generateText({
        system,
        user,
        temperature: 0.3,
        maxTokens: 800,
      });

      return {
        agent: this.name,

        status: "completed",

        confidence: 0.92,

        result: {
          draft,
        },
      };
    } catch (error) {
      return {
        agent: this.name,

        status: "failed",

        confidence: 0,

        result: null,

        error: error.message,
      };
    }
  }
}
