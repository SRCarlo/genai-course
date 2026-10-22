function createConcurrencyLimiter(maxConcurrent) {
  if (!Number.isInteger(maxConcurrent) || maxConcurrent < 1) {
    throw new Error("maxConcurrent must be a positive integer");
  }

  let active = 0;

  return async function run(task) {
    if (active >= maxConcurrent) {
      const error = new Error("Service is busy");
      error.code = "OVER_CAPACITY";
      throw error;
    }

    active += 1;

    try {
      return await task();
    } finally {
      active -= 1;
    }
  };
}

module.exports = { createConcurrencyLimiter };
