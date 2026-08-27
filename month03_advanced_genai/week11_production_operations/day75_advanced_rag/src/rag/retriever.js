import { vectorSearch } from "../services/vector.service.js";

export async function retrieve(query, options = {}) {
  const { topK = 10, metadataFilter = {} } = options;

  return vectorSearch(query, {
    topK,
    metadataFilter,
  });
}
