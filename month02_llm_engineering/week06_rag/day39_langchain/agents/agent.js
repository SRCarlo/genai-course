// agents/agent.js

import chain from "../chains/basicChain.js";
import { calculator } from "../tools/calculator.js";

export async function runAgent(input) {
  const mathRegex = /^[0-9+\-*/().\s]+$/;

  if (mathRegex.test(input)) {
    return calculator(input);
  }

  const response = await chain.invoke({
    topic: input,
  });

  return response.content;
}
