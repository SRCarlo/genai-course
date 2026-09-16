const knowledge = [
  {
    topic: "refund",
    content: "Refund requests are reviewed according to the applicable refund policy."
  },
  {
    topic: "shipping",
    content: "Shipping times depend on the selected delivery method."
  },
  {
    topic: "cancellation",
    content: "Order cancellation is subject to the order's current processing state."
  },
  {
    topic: "support",
    content: "Support can help with orders, customer profiles, and applicable policies."
  }
];

export async function searchKnowledge({ query }) {
  const normalized = String(query || "").toLowerCase().trim();
  if (!normalized) return [];

  const terms = normalized.split(/\s+/).filter((term) => term.length > 2);

  return knowledge.filter((item) =>
    terms.some((term) => item.topic.toLowerCase().includes(term))
  );
}
