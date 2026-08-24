import { redactObject } from "../utils/redaction.js";

const LEVELS = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
  fatal: 50,
};

function shouldLog(currentLevel, messageLevel) {
  return LEVELS[messageLevel] >= LEVELS[currentLevel];
}

function writeLog(level, message, context = {}) {
  const currentLevel = process.env.LOG_LEVEL || "info";

  if (!shouldLog(currentLevel, level)) {
    return;
  }

  const entry = {
    timestamp: new Date().toISOString(),

    level,

    message,

    ...redactObject(context),
  };

  const output = JSON.stringify(entry);

  if (level === "error" || level === "fatal") {
    console.error(output);
  } else {
    console.log(output);
  }
}

export const logger = {
  debug(message, context) {
    writeLog("debug", message, context);
  },

  info(message, context) {
    writeLog("info", message, context);
  },

  warn(message, context) {
    writeLog("warn", message, context);
  },

  error(message, context) {
    writeLog("error", message, context);
  },

  fatal(message, context) {
    writeLog("fatal", message, context);
  },
};

export function requestLogger(req, res, next) {
  const start = process.hrtime.bigint();

  logger.info("Request started", {
    requestId: req.requestId,

    correlationId: req.correlationId,

    method: req.method,

    path: req.path,
  });

  res.on("finish", () => {
    const durationMs = Number(process.hrtime.bigint() - start) / 1_000_000;

    logger.info("Request completed", {
      requestId: req.requestId,

      correlationId: req.correlationId,

      method: req.method,

      path: req.path,

      statusCode: res.statusCode,

      durationMs: Number(durationMs.toFixed(2)),
    });
  });

  next();
}
