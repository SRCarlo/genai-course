import { BaseAgent } from "./base.agent.js";
import { chat } from "../llm/groq.client.js";

export class SupervisorAgent extends BaseAgent {
  constructor() {
    super("supervisor", "Planning and multi-agent orchestration");
  }

  async run(input, state) {
    state.set("task", input);

    const response = await chat({
      system: `
You are a supervisor agent managing a
multi-agent software development workflow.

Available agents:

researcher
coder
reviewer

Your job is to create a simple execution plan.

Rules:

- Research should happen before coding.
- Coding should happen before reviewing.
- Reviewing should happen after coding.
- Do not execute tools yourself.
- Do not write implementation code.
- Return JSON only.

Required format:

{
  "plan": [
    {
      "agent": "researcher",
      "task": "..."
    },
    {
      "agent": "coder",
      "task": "..."
    },
    {
      "agent": "reviewer",
      "task": "..."
    }
  ]
}
`,

      user: input,

      temperature: 0,

      maxCompletionTokens: 1500,
    });

    let plan;

    try {
      plan = JSON.parse(response.content);
    } catch {
      plan = {
        plan: [
          {
            agent: "researcher",
            task: input,
          },
          {
            agent: "coder",
            task: `Implement the requested solution: ${input}`,
          },
          {
            agent: "reviewer",
            task: `Review the implementation for: ${input}`,
          },
        ],
      };
    }

    state.set("plan", plan);

    return plan;
  }
}
