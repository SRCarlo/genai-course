import fs from "node:fs";
import path from "node:path";

const logDir = path.resolve("logs");
const logFile = path.join(logDir, "agent.jsonl");

fs.mkdirSync(logDir, { recursive: true });

export function logEvent(event, data = {}) {
  const record = {
    timestamp: new Date().toISOString(),
    event,
    ...sanitize(data)
  };

  console.log(JSON.stringify(record));
  fs.appendFileSync(logFile, JSON.stringify(record) + "\n");
  return record;
}

function sanitize(value) {
  if (!value || typeof value !== "object") return value;

  const copy = structuredClone(value);
  const secretKeys = ["apiKey", "authorization", "token", "password"];

  function walk(obj) {
    if (!obj || typeof obj !== "object") return;
    for (const key of Object.keys(obj)) {
      if (secretKeys.includes(key.toLowerCase())) {
        obj[key] = "[REDACTED]";
      } else if (typeof obj[key] === "object") {
        walk(obj[key]);
      }
    }
  }

  walk(copy);
  return copy;
}
