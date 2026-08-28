const documents = [
  {
    id: "refund-001",
    title: "Refund Policy",
    content:
      "Customers may request a refund within 30 days of purchase. " +
      "Enterprise customers may have additional contractual refund terms. " +
      "Cancellation fees may apply according to the customer's contract.",
  },
  {
    id: "enterprise-001",
    title: "Enterprise Refund Policy",
    content:
      "Enterprise customers should be evaluated according to their signed contract. " +
      "A standard 20 percent cancellation fee may apply when explicitly specified.",
  },
  {
    id: "shipping-001",
    title: "Shipping Policy",
    content:
      "Orders may be delayed because of carrier issues, warehouse processing, " +
      "weather, customs, or address problems.",
  },
  {
    id: "support-001",
    title: "Customer Support",
    content:
      "Customers can contact support for order issues, refunds, billing questions, " +
      "and account assistance.",
  },
];

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter(Boolean);
}

function scoreDocument(query, document) {
  const queryTokens = tokenize(query);
  const documentTokens = new Set(
    tokenize(`${document.title} ${document.content}`),
  );

  let score = 0;

  for (const token of queryTokens) {
    if (documentTokens.has(token)) {
      score += 1;
    }
  }

  return score;
}

export async function retrieveDocuments(query, topK = 3) {
  const results = documents
    .map((document) => ({
      ...document,
      score: scoreDocument(query, document),
    }))
    .filter((document) => document.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);

  return results;
}
