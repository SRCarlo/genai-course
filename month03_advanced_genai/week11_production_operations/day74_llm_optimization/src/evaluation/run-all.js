import { runBenchmark } from "./benchmark.js";

const model = process.env.GROQ_MODEL || "openai/gpt-oss-20b";

const versions = ["v1", "v2", "v3"];

const results = [];

for (const promptVersion of versions) {
  console.log(`\n____________________________________`);

  console.log(`Testing ${promptVersion}`);

  console.log(`______________________________________`);

  const result = await runBenchmark({
    promptVersion,
    model,
    temperature: 0.3,
  });

  results.push(result);

  console.log(
    JSON.stringify(
      {
        promptVersion,
        quality: result.summary.quality,
        averageLatency: result.summary.averageLatency,
        averageCost: result.summary.averageCost,
        totalCost: result.summary.totalCost,
        accepted: result.summary.accepted,
      },
      null,
      2,
    ),
  );
}

console.log("\nFINAL COMPARISON");

console.table(
  results.map((result) => ({
    prompt: result.promptVersion,
    quality: result.summary.quality.toFixed(3),
    latencyMs: Math.round(result.summary.averageLatency),
    cost: result.summary.averageCost.toFixed(6),
    accepted: result.summary.accepted,
  })),
);
