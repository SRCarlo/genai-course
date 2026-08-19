export function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,

    error: "Route not found",

    path: req.originalUrl,

    requestId: req.requestId,
  });
}
