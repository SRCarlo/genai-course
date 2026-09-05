export function removeDuplicateDocuments(documents) {
  const seen = new Set();

  return documents.filter((document) => {
    const normalized = document.content
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();

    if (seen.has(normalized)) {
      return false;
    }

    seen.add(normalized);

    return true;
  });
}

export function removeLowScoreDocuments(documents, minimumScore = 0.05) {
  return documents.filter((document) => document.rerankScore >= minimumScore);
}

export function compressDocuments(documents, minimumScore = 0.05) {
  const withoutDuplicates = removeDuplicateDocuments(documents);

  return removeLowScoreDocuments(withoutDuplicates, minimumScore);
}
