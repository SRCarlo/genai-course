import crypto from "node:crypto";

export class CustomerService {
  constructor() {
    this.customers = new Map();
  }

  create({ tenantId, email, name }) {
    if (!tenantId || !email || !name) {
      throw new Error("CUSTOMER_FIELDS_REQUIRED");
    }

    const existing = this.getByTenant(tenantId);
    if (existing) return existing;

    const customer = {
      id: `cus_${crypto.randomUUID()}`,
      tenantId,
      email,
      name,
      createdAt: new Date().toISOString()
    };

    this.customers.set(customer.id, customer);
    return customer;
  }

  getByTenant(tenantId) {
    return [...this.customers.values()].find(
      (customer) => customer.tenantId === tenantId
    );
  }

  getById(customerId) {
    return this.customers.get(customerId);
  }
}
