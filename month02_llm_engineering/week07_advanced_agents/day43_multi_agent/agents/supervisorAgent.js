import { researchAgent } from "./researchAgent.js";
import { plannerAgent } from "./plannerAgent.js";
import { codingAgent } from "./codingAgent.js";
import { reviewAgent } from "./reviewAgent.js";

export async function supervisor(task) {
  console.log("Supervisor Started");

  const research = await researchAgent(task);

  const plan = await plannerAgent(research);

  const code = await codingAgent(plan);

  const review = await reviewAgent(code);

  return {
    research,

    plan,

    code,

    review,
  };
}
