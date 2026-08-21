export function errorHandler(err, req, res, next) {
  console.error(err);

  if (err.isOperational) {
    return res.status(err.statusCode).json({
      error: err.message,
    });
  }

  return res.status(500).json({
    error: "Internal server error",
  });
}
