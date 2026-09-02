import { BaseAgent } from "./base.agent.js";

import { agentSuccess, agentFailure } from "../orchestration/result.js";

import { PERMISSIONS } from "../orchestration/permissions.js";

import { validateReview } from "../orchestration/schemas.js";

export class ReviewerAgent extends BaseAgent {
  constructor() {
    super({
      name: "reviewer",

      role: "review",

      permissions: [PERMISSIONS.REVIEW_CODE],

      systemPrompt: `
You are a senior software reviewer.

Review the implementation for:

- correctness
- security
- reliability
- performance
- maintainability
- error handling
- testing

Return ONLY JSON matching:

{
  "approved": true,
  "issues": [],
  "suggestions": []
}

approved must be boolean.
issues must be an array of strings.
suggestions must be an array of strings.
`,
    });
  }

  async run(input, state) {
    try {
      const code = state.get("code") || input;

      const response = await this.askModel(code, {
        temperature: 0,

        maxCompletionTokens: 2000,

        responseFormat: {
          type: "json_schema",

          json_schema: {
            name: "code_review",

            strict: true,

            schema: {
              type: "object",

              properties: {
                approved: {
                  type: "boolean",
                },

                issues: {
                  type: "array",

                  items: {
                    type: "string",
                  },
                },

                suggestions: {
                  type: "array",

                  items: {
                    type: "string",
                  },
                },
              },

              required: ["approved", "issues", "suggestions"],

              additionalProperties: false,
            },
          },
        },
      });

      state.addUsage(response.usage);

      const parsed = JSON.parse(response.content);

      const review = validateReview(parsed);

      state.set("review", review);

      return agentSuccess(
        "reviewer",

        review,

        review.approved ? null : "coder",
      );
    } catch (error) {
      return agentFailure("reviewer", error);
    }
  }
}
