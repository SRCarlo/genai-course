import dotenv from "dotenv";

dotenv.config();

import { askAgent } from "../agents/basicAgent.js";

import { getMemory } from "../memory/memory.js";

async function runAgent() {
  try {
    console.log("Personal AI Agent Started\n");

    // Test 1: Normal AI Question

    const answer1 = await askAgent("What is Artificial Intelligence?");

    console.log("Question 1:");

    console.log(answer1);

    console.log("\n----------------------\n");

    // Test 2: Calculator Tool

    const answer2 = await askAgent("150 * 80");

    console.log("Question 2:");

    console.log(answer2);

    console.log("\n----------------------\n");

    // Test 3: Agent Memory

    console.log("Memory:");

    console.log(getMemory());
  } catch (error) {
    console.log("Agent Error:", error.message);
  }
}

runAgent();
