import { getPlan } from "../utils/plans.js";

/*
 * In-memory concurrency tracking.
 *
 * This is suitable for Day 70 learning/testing.
 *
 * Production:
 * Use Redis or another shared distributed store.
 */

const activeRequests = new Map();


export function concurrencyLimiter(req, res, next) {
  const userId =
    req.user?.id || req.ip;

  const planName =
    req.user?.planName || "free";

  const plan =
    req.user?.plan || getPlan(planName);

  const maxConcurrentRequests =
    plan.maxConcurrentRequests;

  const currentCount =
    activeRequests.get(userId) || 0;


  /*
   * User has reached their concurrent request limit.
   */
  if (
    currentCount >= maxConcurrentRequests
  ) {
    return res.status(429).json({
      error: "concurrency_limit_exceeded",

      message:
        "Too many AI requests are running simultaneously.",

      activeRequests: currentCount,

      limit: maxConcurrentRequests,

      retryable: true,
    });
  }


  /*
   * Reserve a concurrency slot.
   */
  activeRequests.set(
    userId,
    currentCount + 1
  );


  /*
   * Release the slot when the request
   * finishes, errors, or the connection closes.
   */
  let released = false;

  const release = () => {
    if (released) {
      return;
    }

    released = true;

    const current =
      activeRequests.get(userId) || 0;

    if (current <= 1) {
      activeRequests.delete(userId);
    } else {
      activeRequests.set(
        userId,
        current - 1
      );
    }
  };


  res.on("finish", release);
  res.on("close", release);
  res.on("error", release);


  next();
}


/*
 * Useful for tests.
 */
export function getActiveRequests(userId) {
  return activeRequests.get(userId) || 0;
}


/*
 * Useful for tests.
 */
export function resetConcurrency() {
  activeRequests.clear();
}