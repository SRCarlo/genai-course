const KNOWLEDGE_BASE = [
  {
    id: "order-1001",
    text: "Order 1001 contains a laptop and is expected to be delivered on 2026-09-20."
  },
  {
    id: "order-1002",
    text: "Order 1002 contains headphones and is expected to be delivered on 2026-09-18."
  },
  {
    id: "policy-refund",
    text: "Refund requests can be submitted within 30 days of delivery."
  }
];

export async function search(query) {
  // Simulated tool for Day 94 observability practice.
  // Replace this implementation later with a real search/database API.
  const normalized = query.toLowerCase();

  const results = KNOWLEDGE_BASE.filter(item =>
    item.text.toLowerCase().includes(normalized) ||
    normalized.split(/\s+/).some(word =>
      word.length > 3 && item.text.toLowerCase().includes(word)
    )
  );

  await new Promise(resolve => setTimeout(resolve, 100));

  return results.length
    ? results
    : [{ id: "no-result", text: "No matching document was found." }];
}
