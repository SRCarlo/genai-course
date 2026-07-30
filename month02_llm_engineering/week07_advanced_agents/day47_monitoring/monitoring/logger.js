import fs from "fs";

const logFile = "./logs/app.log";

export function log(message) {
  const data = `[LOG] ${new Date().toISOString()} ${message}\n`;

  console.log(data);

  fs.appendFileSync(logFile, data);
}

export function errorLog(message) {
  const data = `[ERROR] ${new Date().toISOString()} ${message}\n`;

  console.error(data);

  fs.appendFileSync(logFile, data);
}
