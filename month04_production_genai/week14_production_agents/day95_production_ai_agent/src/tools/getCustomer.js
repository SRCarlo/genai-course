const customers = {
  "CUST-001": {
    id: "CUST-001",
    name: "Demo User",
    email: "demo@example.com"
  },
  "CUST-002": {
    id: "CUST-002",
    name: "Test Customer",
    email: "test@example.com"
  }
};

export async function getCustomer({ customerId }) {
  if (!customerId) return null;
  return customers[customerId] ?? null;
}

export function getCustomerRecord(customerId) {
  return customers[customerId] ?? null;
}
