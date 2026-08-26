import { runBenchmark } from "./benchmark.js";

const model = process.env.GROQ_MODEL || "openai/gpt-oss-20b";

const temperatures = [0.1, 0.3, 0.7];

for (const temperature of temperatures) {
  console.log(`\nRunning temperature=${temperature}`);

  const result = await runBenchmark({
    promptVersion: "v3",
    model,
    temperature,
  });

  console.log(
    JSON.stringify(
      {
        temperature,
        quality: result.summary.quality,
        averageLatency: result.summary.averageLatency,
        averageCost: result.summary.averageCost,
      },
      null,
      2,
    ),
  );
}
