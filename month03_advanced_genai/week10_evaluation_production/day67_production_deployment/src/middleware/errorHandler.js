export function errorHandler(err, req, res, next) {
  console.error(
    JSON.stringify({
      level: "error",

      event: "request.failed",

      requestId: req.requestId,

      error: err.message,

      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,

      timestamp: new Date().toISOString(),
    }),
  );

  if (res.headersSent) {
    return next(err);
  }

  res.status(500).json({
    success: false,

    error: "Internal server error",

    requestId: req.requestId,
  });
}
