const LEVELS = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
  fatal: 50
};

const configuredLevel = process.env.LOG_LEVEL || "info";

export function log(level, event, metadata = {}) {
  if ((LEVELS[level] ?? 20) < (LEVELS[configuredLevel] ?? 20)) {
    return;
  }

  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    event,
    ...metadata
  }));
}

export const logger = {
  debug: (event, metadata) => log("debug", event, metadata),
  info: (event, metadata) => log("info", event, metadata),
  warn: (event, metadata) => log("warn", event, metadata),
  error: (event, metadata) => log("error", event, metadata),
  fatal: (event, metadata) => log("fatal", event, metadata)
};
