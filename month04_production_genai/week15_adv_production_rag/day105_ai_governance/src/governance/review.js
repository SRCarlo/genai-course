export function needsReview(lastReviewedAt, reviewDays = 90) {
  const lastReview = new Date(lastReviewedAt);

  if (Number.isNaN(lastReview.getTime())) {
    throw new TypeError("lastReviewedAt must be a valid date.");
  }

  if (!Number.isFinite(reviewDays) || reviewDays < 0) {
    throw new RangeError("reviewDays must be a non-negative number.");
  }

  const age = Date.now() - lastReview.getTime();
  const days = age / (1000 * 60 * 60 * 24);

  return days >= reviewDays;
}
