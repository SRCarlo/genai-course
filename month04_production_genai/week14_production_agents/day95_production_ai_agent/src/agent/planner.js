import { z } from "zod";

const PlanSchema = z.object({
  agent: z.enum(["research", "order", "customer"]),
  tool: z.enum(["getOrder", "searchKnowledge", "getCustomer", "updateCustomer"]),
  args: z.record(z.string(), z.any()),
  reason: z.string()
});

function extractOrderId(input) {
  return input.match(/\bORD-\d+\b/i)?.[0]?.toUpperCase() || null;
}

function extractCustomerId(input) {
  return input.match(/\bCUST-\d+\b/i)?.[0]?.toUpperCase() || null;
}

function extractEmail(input) {
  return input.match(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i)?.[0] || null;
}

export function plan(input) {
  const text = input.toLowerCase();
  const orderId = extractOrderId(input);
  const customerId = extractCustomerId(input);
  const email = extractEmail(input);

  if (
    text.includes("update") &&
    (text.includes("email") || text.includes("change my email"))
  ) {
    return PlanSchema.parse({
      agent: "customer",
      tool: "updateCustomer",
      args: { customerId, email },
      reason: "The request asks to update a customer email."
    });
  }

  if (
    orderId ||
    text.includes("order status") ||
    text.includes("delivery") ||
    text.includes("cancel my order") ||
    text.includes("order")
  ) {
    return PlanSchema.parse({
      agent: "order",
      tool: "getOrder",
      args: { orderId },
      reason: "The request concerns an order."
    });
  }

  if (customerId || text.includes("customer") || text.includes("profile")) {
    return PlanSchema.parse({
      agent: "customer",
      tool: "getCustomer",
      args: { customerId },
      reason: "The request concerns customer information."
    });
  }

  return PlanSchema.parse({
    agent: "research",
    tool: "searchKnowledge",
    args: { query: input },
    reason: "No transactional identifier was found, so knowledge search is used."
  });
}

export function validatePlan(planObject) {
  return PlanSchema.parse(planObject);
}
