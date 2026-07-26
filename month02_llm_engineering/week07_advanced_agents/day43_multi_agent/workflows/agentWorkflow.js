import { supervisor } from "../agents/supervisorAgent.js";

export async function execute(task) {
  return await supervisor(task);
}
