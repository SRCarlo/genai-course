let totalTokens = 0;

export function countTokens(text) {
  const tokens = text.trim().split(/\s+/).length;

  totalTokens += tokens;

  return tokens;
}

export function getTokenMetrics() {
  return {
    totalTokens,
  };
}
