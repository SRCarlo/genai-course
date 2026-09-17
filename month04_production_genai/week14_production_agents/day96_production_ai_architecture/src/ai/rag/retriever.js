const documents = [
  {
    id: "doc-1",
    tenantId: "tenant-123",
    title: "Refund Policy",
    content: "Customers can request a refund within 30 days of purchase.",
  },

  {
    id: "doc-2",
    tenantId: "tenant-123",
    title: "Shipping Policy",
    content: "Standard shipping usually takes 5 to 7 business days.",
  },

  {
    id: "doc-3",
    tenantId: "tenant-123",
    title: "Support Policy",
    content: "Customers can contact support Monday through Friday.",
  },
];

export async function retrieve(query, tenantId, topK = 3) {
  const tenantDocuments = documents.filter(
    (document) => document.tenantId === tenantId,
  );

  const words = query.toLowerCase().split(/\s+/);

  const scored = tenantDocuments.map((document) => {
    const content = `${document.title} ${document.content}`.toLowerCase();

    const score = words.reduce(
      (total, word) => total + (content.includes(word) ? 1 : 0),
      0,
    );

    return {
      ...document,
      score,
    };
  });

  return scored
    .filter((document) => document.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}
