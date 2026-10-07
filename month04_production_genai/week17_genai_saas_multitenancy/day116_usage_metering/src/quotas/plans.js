export const PLANS = Object.freeze({
  free: Object.freeze({
    requestsPerMinute: 10,
    monthlyRequests: 1_000,
    monthlyTokens: 100_000
  }),
  starter: Object.freeze({
    requestsPerMinute: 60,
    monthlyRequests: 10_000,
    monthlyTokens: 1_000_000
  }),
  pro: Object.freeze({
    requestsPerMinute: 300,
    monthlyRequests: 100_000,
    monthlyTokens: 10_000_000
  })
});
