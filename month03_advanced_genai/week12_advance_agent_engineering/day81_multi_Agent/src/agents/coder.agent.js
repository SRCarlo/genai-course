import { BaseAgent } from "./base.agent.js";

import { agentSuccess, agentFailure } from "../orchestration/result.js";

import { PERMISSIONS } from "../orchestration/permissions.js";

export class CoderAgent extends BaseAgent {
  constructor() {
    super({
      name: "coder",

      role: "implementation",

      permissions: [PERMISSIONS.WRITE_CODE],

      systemPrompt: `
You are a senior Node.js engineer.

Your job is to implement the requested solution.

Consider:
- correctness
- maintainability
- security
- performance
- error handling
- testing

You may receive research and reviewer feedback.

When reviewer feedback exists, improve the previous implementation.

Return practical Node.js code and explain important implementation decisions.
`,
    });
  }

  async run(input, state) {
    try {
      const research = state.get("research");

      const previousCode = state.get("code");

      const reviewFeedback = state.get("reviewFeedback");

      const prompt = {
        task: state.get("task"),

        research,

        previousCode,

        reviewFeedback,

        currentInput: input,
      };

      const response = await this.askModel(prompt, {
        temperature: 0.2,

        maxCompletionTokens: 4000,
      });

      state.addUsage(response.usage);

      const implementation = {
        description: "Node.js implementation",

        code: response.content,

        basedOn: research,

        feedbackApplied: reviewFeedback || null,
      };

      state.set("code", implementation);

      return agentSuccess(
        "coder",

        implementation,

        "reviewer",
      );
    } catch (error) {
      return agentFailure("coder", error);
    }
  }
}
