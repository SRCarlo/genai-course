import { BaseAgent } from "./base.agent.js";

import { agentSuccess, agentFailure } from "../orchestration/result.js";

import { PERMISSIONS } from "../orchestration/permissions.js";

export class SecurityAgent extends BaseAgent {
  constructor() {
    super({
      name: "security",

      role: "security-review",

      permissions: [PERMISSIONS.SECURITY_REVIEW],

      systemPrompt: `
You are a senior application security engineer.

Analyze the supplied API or implementation.

Look for:
- authentication problems
- authorization problems
- injection
- secrets exposure
- insecure dependencies
- input validation issues
- data leakage
- unsafe defaults

Return a concise security report.
`,
    });
  }

  async run(input, state) {
    try {
      const response = await this.askModel(input, {
        temperature: 0.1,

        maxCompletionTokens: 2500,
      });

      state.addUsage(response.usage);

      const data = {
        perspective: "security",

        report: response.content,
      };

      state.set("securityReview", data);

      return agentSuccess("security", data, null);
    } catch (error) {
      return agentFailure("security", error);
    }
  }
}
