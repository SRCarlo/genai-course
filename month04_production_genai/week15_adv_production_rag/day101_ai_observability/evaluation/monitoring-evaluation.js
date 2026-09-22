import fs from "node:fs/promises";
import {
  getMetrics,
  resetMetrics,
} from "../src/infrastructure/observability/metrics.js";
import { checkAlerts } from "../src/infrastructure/observability/alerts.js";

const dataset = JSON.parse(
  await fs.readFile(new URL("./dataset.json", import.meta.url), "utf-8"),
);
resetMetrics();
console.log("Day 101 Monitoring Evaluation");
console.log("==============================");
console.log(`Evaluation cases: ${dataset.length}`);
console.log("\nCurrent metrics:");
console.log(JSON.stringify(getMetrics(), null, 2));
console.log("\nCurrent alerts:");
console.log(JSON.stringify(checkAlerts(getMetrics()), null, 2));
