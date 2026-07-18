
import { runAgent } from "../agents/agent.js";

import { addMessage, getHistory } from "../memory/memory.js";

import { calculator } from "../tools/calculator.js";

async function chat(message) {
  // Save user message

  addMessage("user", message);

  // Run agent

  const response = await runAgent(message);

  // Save assistant response

  addMessage("assistant", response);

  return response;
}

// Example usage

async function main() {
  console.log("AI Assistant Started");

  const answer1 = await chat("Explain embeddings");

  console.log("\nAssistant:", answer1);

  const answer2 = await chat("200 * 50");

  console.log("\nCalculator:", answer2);

  console.log("\nConversation History:");

  console.log(getHistory());
}

main();
