export function errorHandler(err, req, res, next) {
  console.error(err);

  if (res.headersSent) {
    return next(err);
  }

  return res.status(500).json({
    error: "internal_server_error",
    message: "Something went wrong"
  });
}