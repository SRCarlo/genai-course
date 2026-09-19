export function errorHandler(error, req, res, next) {
  console.error(
    JSON.stringify({
      event: "request_error",
      requestId: req.auth?.requestId,
      error: error.message
    })
  );

  res.status(500).json({
    error: "Internal server error",
    requestId: req.auth?.requestId
  });
}
