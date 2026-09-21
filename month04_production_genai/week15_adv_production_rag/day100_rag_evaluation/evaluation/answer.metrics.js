export function calculateKeywordCoverage(answer = "", expectedTopics = []) {
  if (!expectedTopics.length) return 1;

  const normalizedAnswer = answer.toLowerCase();

  const matched = expectedTopics.filter((topic) =>
    normalizedAnswer.includes(topic.toLowerCase()),
  );

  return matched.length / expectedTopics.length;
}

export function calculateContextRelevance(
  question = "",
  retrievedDocuments = [],
) {
  if (!retrievedDocuments.length) return 0;

  const q = new Set(
    question
      .toLowerCase()
      .split(/\s+/)
      .map((x) => x.replace(/[^a-z0-9]/g, ""))
      .filter(Boolean),
  );

  const scores = retrievedDocuments.map((doc) => {
    const text = `${doc.title} ${doc.text}`.toLowerCase();
    let matches = 0;

    for (const token of q) {
      if (token.length > 2 && text.includes(token)) matches += 1;
    }

    return q.size ? matches / q.size : 0;
  });

  return scores.reduce((a, b) => a + b, 0) / scores.length;
}
