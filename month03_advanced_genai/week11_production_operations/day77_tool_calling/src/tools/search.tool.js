const knowledgeBase = [
  {
    id: "refund-policy",
    content: "Enterprise refunds are available within 30 days of purchase.",
  },
  {
    id: "shipping-policy",
    content: "Standard shipping normally takes 5 to 7 business days.",
  },
  {
    id: "support-policy",
    content: "Customers can contact support for order-related issues.",
  },
];

export async function searchKnowledgeBase({ query }) {
  const normalizedQuery = query.toLowerCase();

  const results = knowledgeBase.filter((item) =>
    item.content
      .toLowerCase()
      .includes(
        normalizedQuery.includes("refund")
          ? "refund"
          : normalizedQuery.includes("shipping")
            ? "shipping"
            : normalizedQuery.includes("support")
              ? "support"
              : normalizedQuery,
      ),
  );

  return {
    success: true,
    results,
  };
}
