import { trackError } from "../monitoring/metrics.js";

import { errorLog } from "../monitoring/logger.js";

export function errorHandler(err, req, res, next) {
  trackError();

  errorLog(err.message);

  res.status(500).json({
    error: err.message,
  });
}
