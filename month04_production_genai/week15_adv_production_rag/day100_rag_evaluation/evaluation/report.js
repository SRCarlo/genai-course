import fs from "node:fs/promises";

const path = new URL("./report.json", import.meta.url);

try {
  const report = JSON.parse(await fs.readFile(path, "utf8"));

  console.log("=== DAY 100 REPORT ===");
  console.log(`Generated: ${report.generatedAt}`);
  console.log(`Model: ${report.model}`);
  console.log("");
  console.log("Retrieval:");
  console.log(JSON.stringify(report.retrieval, null, 2));
  console.log("");
  console.log("Generation:");
  console.log(JSON.stringify(report.generation, null, 2));
  console.log("");
  console.log("System:");
  console.log(JSON.stringify(report.system, null, 2));
  console.log("");
  console.log("Quality Gate:");
  console.log(JSON.stringify(report.qualityGate, null, 2));
} catch {
  console.error("No report.json found. Run: npm run evaluate");
  process.exitCode = 1;
}
