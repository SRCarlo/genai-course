import crypto from "node:crypto";

export function requestLogger(req, res, next) {
  const requestId = req.headers["x-request-id"] || crypto.randomUUID();

  req.requestId = requestId;

  res.setHeader("x-request-id", requestId);

  const startTime = Date.now();

  res.on("finish", () => {
    const latencyMs = Date.now() - startTime;

    console.log(
      JSON.stringify({
        level: "info",

        event: "request.completed",

        requestId,

        method: req.method,

        path: req.originalUrl,

        statusCode: res.statusCode,

        latencyMs,

        timestamp: new Date().toISOString(),
      }),
    );
  });

  next();
}
