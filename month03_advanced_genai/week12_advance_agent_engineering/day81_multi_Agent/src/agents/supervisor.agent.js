import { BaseAgent } from "./base.agent.js";

export class SupervisorAgent extends BaseAgent {
  constructor() {
    super({
      name: "supervisor",

      role: "orchestration",

      systemPrompt: `
You are the supervisor of a multi-agent
software development workflow.

You coordinate:

- researcher
- coder
- reviewer

Your job is to:

- maintain workflow state
- coordinate handoffs
- handle failures
- enforce limits
- manage review feedback
- terminate workflows safely

Do not directly implement application code.
`,
    });
  }

  async run(input, state) {
    state.set("task", input);

    return {
      success: true,

      agent: "supervisor",

      data: {
        task: input,
      },

      nextAgent: "researcher",

      error: null,
    };
  }
}
