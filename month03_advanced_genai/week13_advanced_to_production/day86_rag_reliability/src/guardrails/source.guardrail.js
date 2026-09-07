export function validateSources(
  response,
  retrievedDocuments
) {
  const validIds =
    new Set(
      retrievedDocuments.map(
        (document) =>
          document.documentId
      )
    );

  const validSources =
    response.sources.filter(
      (source) =>
        validIds.has(
          source.documentId
        )
    );

  return {
    ...response,
    sources: validSources
  };
}