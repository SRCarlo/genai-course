import { promptV1 } from "./v1.js";
import { promptV2 } from "./v2.js";
import { promptV3 } from "./v3.js";

const prompts = {
  v1: promptV1,
  v2: promptV2,
  v3: promptV3,
};

export function getPrompt(version = "v1") {
  const prompt = prompts[version];

  if (!prompt) {
    throw new Error(`Unknown prompt version: ${version}`);
  }

  return prompt;
}

export function listPromptVersions() {
  return Object.keys(prompts);
}
