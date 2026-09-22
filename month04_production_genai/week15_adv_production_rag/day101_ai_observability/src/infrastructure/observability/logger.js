function writeLog(level, data) {
  const logEntry = { level, timestamp: new Date().toISOString(), ...data };
  const output = JSON.stringify(logEntry);
  if (level === "error") return console.error(output);
  if (level === "warn") return console.warn(output);
  console.log(output);
}
export const logger = {
  info(data) {
    writeLog("info", data);
  },
  warn(data) {
    writeLog("warn", data);
  },
  error(data) {
    writeLog("error", data);
  },
};
