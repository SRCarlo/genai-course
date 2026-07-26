import { supervisor } from "../agents/supervisorAgent.js";

async function main() {
  const result = await supervisor("Build Authentication API");

  console.log(result);
}

main();
