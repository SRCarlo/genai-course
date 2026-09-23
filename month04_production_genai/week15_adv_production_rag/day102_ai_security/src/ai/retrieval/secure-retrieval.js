import { documents } from "./documents.js";
import { canAccessDocument } from "../../security/access-policy.js";

function scoreDocument(document, query) {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  const content = `${document.content} ${document.source}`.toLowerCase();

  return terms.reduce(
    (score, term) => score + (content.includes(term) ? 1 : 0),
    0,
  );
}

export function retrieveSecureDocuments({ user, query, limit = 4 }) {
  if (!user?.id || !user?.tenantId) {
    throw new Error("Unauthorized retrieval request");
  }

  // Authorization is applied before the result reaches the LLM.
  const authorized = documents.filter((document) =>
    canAccessDocument({ user, document }),
  );

  return authorized
    .map((document) => ({
      ...document,
      score: scoreDocument(document, query),
    }))
    .filter((document) => document.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
