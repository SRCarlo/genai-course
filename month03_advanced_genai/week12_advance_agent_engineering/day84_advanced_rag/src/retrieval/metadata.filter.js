export function filterByMetadata(documents, filters = {}) {
  return documents.filter((document) => {
    return Object.entries(filters).every(([key, value]) => {
      if (value === undefined) {
        return true;
      }

      return document[key] === value;
    });
  });
}
