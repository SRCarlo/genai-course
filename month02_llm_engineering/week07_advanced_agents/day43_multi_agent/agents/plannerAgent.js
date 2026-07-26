export async function plannerAgent(researchData) {
  console.log("Planner Agent Running...");

  return {
    project: researchData.task,

    steps: [
      "Create Express Project",

      "Configure Environment",

      "Connect MongoDB",

      "Create Models",

      "Create Controllers",

      "Create Routes",

      "Test APIs",
    ],
  };
}
