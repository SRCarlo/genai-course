export default function hybridSearch(results, question) {
  const query = question
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

  return results.map((doc) => {
    let matches = 0;

    doc.keywords.forEach((keyword) => {
      if (query.includes(keyword)) {
        matches++;
      }
    });

    const keywordScore = matches / doc.keywords.length;

    const score = doc.vectorScore * 0.7 + keywordScore * 0.3;

    return {
      ...doc,

      keywordScore,

      score,
    };
  });
}
