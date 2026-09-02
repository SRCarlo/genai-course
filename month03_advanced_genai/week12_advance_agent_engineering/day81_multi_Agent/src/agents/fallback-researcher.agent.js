import { BaseAgent } from "./base.agent.js";

import { PERMISSIONS } from "../orchestration/permissions.js";

import { agentSuccess, agentFailure } from "../orchestration/result.js";

export class FallbackResearcherAgent extends BaseAgent {
  constructor() {
    super({
      name: "fallback-researcher",

      role: "fallback-research",

      permissions: [PERMISSIONS.RESEARCH],

      systemPrompt: `
You are a fallback technical researcher.

The primary researcher failed.

Perform a conservative research pass.

Focus on:
- essential concepts
- implementation requirements
- risks
- practical recommendations

Keep the response concise.
`,
    });
  }

  async run(input, state) {
    try {
      const response = await this.askModel(input, {
        temperature: 0.1,

        maxCompletionTokens: 1500,
      });

      state.addUsage(response.usage);

      const data = {
        fallback: true,

        findings: [response.content],
      };

      state.set("research", data);

      return agentSuccess(
        "fallback-researcher",

        data,

        "coder",
      );
    } catch (error) {
      return agentFailure("fallback-researcher", error);
    }
  }
}
