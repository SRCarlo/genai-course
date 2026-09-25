import "dotenv/config";
import { readFile } from "node:fs/promises";
import { generateIncidentAnalysis } from "./groq-client.js";

const incident = JSON.parse(
  await readFile(
    new URL("../../evaluation/incidents/sample-incident.json", import.meta.url),
    "utf8",
  ),
);

const analysis = await generateIncidentAnalysis({
  incident,
  evidence: [
    "Cross-tenant document access was detected.",
    "The affected retrieval path was identified.",
    "The incident remains under investigation.",
  ],
});

console.log("\n=== Groq Incident Analysis ===\n");
console.log(analysis);
