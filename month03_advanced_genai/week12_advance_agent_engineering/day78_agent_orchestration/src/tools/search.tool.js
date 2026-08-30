const knowledgeBase = [
  {
    title: "Refund Policy",
    content:
      "Customers can request a refund within 30 days of delivery for eligible products. Products must be returned in acceptable condition.",
  },

  {
    title: "Shipping Policy",
    content: "Standard shipping normally takes 3 to 7 business days.",
  },

  {
    title: "Cancellation Policy",
    content:
      "Orders can be cancelled before fulfillment. Cancellation of certain orders may require human approval.",
  },
];

export async function searchKnowledgeBase({ query }) {
  if (!query) {
    throw new Error("Search query is required");
  }

  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);

  const results = knowledgeBase.filter((document) => {
    const text = `${document.title} ${document.content}`.toLowerCase();

    return terms.some((term) => text.includes(term));
  });

  return {
    query,
    results,
  };
}
