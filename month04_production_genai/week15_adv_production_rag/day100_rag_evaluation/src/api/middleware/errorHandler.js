export function errorHandler(error, req, res, next) {
  console.error({
    requestId: req.requestId,
    error: error.message,
    stack: error.stack,
  });

  res.status(500).json({
    requestId: req.requestId,
    error: {
      type: "UNKNOWN_ERROR",
      message: "Internal server error.",
    },
  });
}
