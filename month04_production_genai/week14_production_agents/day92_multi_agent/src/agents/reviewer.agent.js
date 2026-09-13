import { BaseAgent } from "./base.agent.js";

import { generateText } from "../llm/groq.client.js";

export class ReviewerAgent extends BaseAgent {
  constructor() {
    super({
      name: "reviewer-agent",

      role: "Review analysis for consistency and missing information",

      tools: [],

      permissions: ["review"],
    });
  }

  async execute(input) {
    try {
      const system = `
You are a strict reviewer agent.

Review the analysis.

Check:

1. Missing information
2. Contradictions
3. Unsupported conclusions
4. Unclear recommendation

Be concise.

Return JSON only:

{
  "approved": true,
  "issues": [],
  "suggestions": []
}
`;

      const user = `
Original task:
${input.task}

Analysis:
${JSON.stringify(input.analysis, null, 2)}

Return ONLY valid JSON.
`;

      const raw = await generateText({
        system,
        user,
        temperature: 0.1,
        maxTokens: 300,
      });

      let review;

      try {
        review = JSON.parse(raw);
      } catch {
        review = {
          approved: false,

          issues: ["Reviewer returned non-JSON output"],

          suggestions: [],
        };
      }

      return {
        agent: this.name,

        status: "completed",

        confidence: 0.9,

        result: {
          review,
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
