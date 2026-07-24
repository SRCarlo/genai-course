import { handleQuestion } from "../agents/toolAgent.js";

async function main() {
  console.log(await handleQuestion("What is 50 * 90?"));

  console.log(await handleQuestion("weather Mumbai"));

  console.log(await handleQuestion("github repository"));
}

main();
