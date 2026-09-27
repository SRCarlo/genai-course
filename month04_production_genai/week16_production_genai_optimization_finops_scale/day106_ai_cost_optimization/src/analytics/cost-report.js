import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "../..");
const reportPath = path.join(
  projectRoot,
  "reports",
  "day106-cost-report.json"
);

function round(value, digits = 6) {
  return Number(value.toFixed(digits));
}

export function buildCostReport(events) {
  const requests = events.length;

  const inputTokens = events.reduce(
    (sum, event) => sum + event.inputTokens,
    0
  );

  const outputTokens = events.reduce(
    (sum, event) => sum + event.outputTokens,
    0
  );

  const totalCost = events.reduce(
    (sum, event) => sum + event.cost,
    0
  );

  const cacheHits = events.filter(event => event.cacheHit).length;
  const retries = events.filter(event => event.retryCount > 0).length;

  return {
    period: new Date().toISOString().slice(0, 10),
    requests,
    inputTokens,
    outputTokens,
    totalCost: round(totalCost),
    cacheHitRate: requests ? round(cacheHits / requests, 4) : 0,
    retryRate: requests ? round(retries / requests, 4) : 0,
    avgCostPerRequest: requests
      ? round(totalCost / requests)
      : 0
  };
}

export function writeCostReport(events) {
  const report = buildCostReport(events);

  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(
    reportPath,
    JSON.stringify(report, null, 2),
    "utf8"
  );

  return report;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const demoEvents = [
    {
      inputTokens: 2000,
      outputTokens: 500,
      cost: 0.004,
      cacheHit: false,
      retryCount: 0
    },
    {
      inputTokens: 1800,
      outputTokens: 400,
      cost: 0.0032,
      cacheHit: true,
      retryCount: 0
    }
  ];

  console.log(writeCostReport(demoEvents));
}