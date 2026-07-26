export async function researchAgent(task) {
  console.log("Research Agent Running...");

  return {
    task,

    technologies: ["Node.js", "Express", "MongoDB", "REST API"],

    research: `
The project "${task}" should use Express for APIs,
MongoDB for storage and follow REST principles.
`,
  };
}
