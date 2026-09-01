import { BaseAgent } from "./base.agent.js";
import { chat } from "../llm/groq.client.js";

export class AggregatorAgent extends BaseAgent {
  constructor() {
    super(
      "aggregator",
      "Combines specialist results into final answer"
    );
  }

  async run(input, state) {
    const research = state.get("research");
    const code = state.get("code");
    const review = state.get("review");

    const response = await chat({
      system: `
You are the final response aggregator.

Combine the outputs of the research,
coding, and review agents.

Give the user a useful final answer.

Do not claim that something was implemented
if the coding agent only generated a proposal.

Clearly mention important security issues.
`,

      user: `
ORIGINAL TASK:

${input}

RESEARCH:

${JSON.stringify(research, null, 2)}

CODE:

${JSON.stringify(code, null, 2)}

REVIEW:

${JSON.stringify(review, null, 2)}

Create the final response.
`,

      temperature: 0.2,

      maxCompletionTokens: 4000
    });

    const result = {
      answer: response.content,
      usage: response.usage
    };

    state.set(
      "finalAnswer",
      result
    );

    return result;
  }
}
