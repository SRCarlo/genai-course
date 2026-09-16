export function enforceBusinessPolicy({
  toolName,
  args,
  role,
  customerId
}) {
  if (toolName === "updateCustomer") {
    if (!["authenticated-user", "admin"].includes(role)) {
      throw new Error("Authentication required for customer updates");
    }

    if (role !== "admin" && args.customerId !== customerId) {
      throw new Error("Users may only update their own customer profile");
    }
  }
}
