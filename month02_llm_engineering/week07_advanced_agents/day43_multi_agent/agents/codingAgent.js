export async function codingAgent(plan) {
  console.log("Coding Agent Running...");

  return {
    message: "Code Generated Successfully",

    implementation: `

Express Server

MongoDB Connection

REST APIs

Folder Structure Created

${plan.steps.join("\n")}

`,
  };
}
