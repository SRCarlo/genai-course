export function canReadOrder({ userId, order }) {
  return Boolean(userId && order && order.userId === userId);
}

export function canReadCustomer({ userId, customer }) {
  return Boolean(userId && customer && customer.id === userId);
}

export function canAccessResource({ user, resource, ownerField = "userId" }) {
  if (!user || !resource) return false;
  return user.role === "admin" || resource[ownerField] === user.id;
}

export function canRefund({ user, order }) {
  if (!user || !order) return false;
  return user.role === "manager" || user.role === "admin";
}
