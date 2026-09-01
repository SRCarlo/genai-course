import { BaseAgent } from "./base.agent.js";
import { generateCode } from "../tools/code.tool.js";

export class CoderAgent extends BaseAgent {
  constructor() {
    super("coder", "Software implementation");
  }

  async run(input, state) {
    const research = state.get("research");

    if (!research) {
      throw new Error("Coder requires research before implementation.");
    }

    const result = await generateCode({
      task: input,
      research: research.findings,
    });

    state.set("code", result);

    return result;
  }
}
