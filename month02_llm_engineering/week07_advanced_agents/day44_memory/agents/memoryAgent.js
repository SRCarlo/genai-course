import { remember, recall } from "../memory/memoryManager.js";

export async function memoryAgent(message) {
  remember(message);

  return {
    history: recall(),
  };
}
