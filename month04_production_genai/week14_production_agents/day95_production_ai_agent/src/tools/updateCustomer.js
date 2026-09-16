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

export async function updateCustomer({ customerId, email }) {
  if (!customerId || !email) {
    throw new Error("customerId and email are required");
  }

  if (!customers[customerId]) {
    return { success: false, customerId, email, reason: "customer_not_found" };
  }

  customers[customerId].email = email;

  return {
    success: true,
    customerId,
    email
  };
}
