import crypto from "node:crypto";

export class InvoiceService {
  constructor() {
    this.invoices = new Map();
  }

  createInvoice({
    tenantId,
    subscriptionId,
    periodStart,
    periodEnd,
    currency = "USD",
    idempotencyKey
  }) {
    if (idempotencyKey) {
      const existing = this.findByIdempotencyKey(idempotencyKey);
      if (existing) return existing;
    }

    const invoice = {
      id: `inv_${crypto.randomUUID()}`,
      tenantId,
      subscriptionId,
      periodStart,
      periodEnd,
      currency,
      status: "draft",
      items: [],
      subtotalCents: 0,
      taxCents: 0,
      totalCents: 0,
      idempotencyKey: idempotencyKey ?? null,
      createdAt: new Date().toISOString()
    };

    this.invoices.set(invoice.id, invoice);
    return invoice;
  }

  addInvoiceItem(invoiceId, {
    description,
    quantity,
    unitAmountCents,
    amountCents = quantity * unitAmountCents
  }) {
    const invoice = this.getById(invoiceId);

    if (!description || !Number.isFinite(quantity) || !Number.isFinite(unitAmountCents)) {
      throw new Error("INVALID_INVOICE_ITEM");
    }

    const item = {
      id: `ii_${crypto.randomUUID()}`,
      description,
      quantity,
      unitAmountCents,
      amountCents
    };

    invoice.items.push(item);
    this.calculateInvoiceTotal(invoiceId);
    return item;
  }

  calculateInvoiceTotal(invoiceId, taxCents = 0) {
    const invoice = this.getById(invoiceId);

    invoice.subtotalCents = invoice.items.reduce(
      (sum, item) => sum + item.amountCents,
      0
    );

    invoice.taxCents = taxCents;
    invoice.totalCents = invoice.subtotalCents + invoice.taxCents;

    return invoice;
  }

  finalizeInvoice(invoiceId) {
    const invoice = this.getById(invoiceId);

    if (invoice.items.length === 0) {
      throw new Error("INVOICE_HAS_NO_ITEMS");
    }

    invoice.status = "open";
    invoice.finalizedAt = new Date().toISOString();
    return invoice;
  }

  markPaid(invoiceId) {
    const invoice = this.getById(invoiceId);
    invoice.status = "paid";
    invoice.paidAt = new Date().toISOString();
    return invoice;
  }

  markPaymentFailed(invoiceId) {
    const invoice = this.getById(invoiceId);
    invoice.status = "payment_failed";
    return invoice;
  }

  getById(invoiceId) {
    const invoice = this.invoices.get(invoiceId);
    if (!invoice) throw new Error("INVOICE_NOT_FOUND");
    return invoice;
  }

  listByTenant(tenantId) {
    return [...this.invoices.values()]
      .filter((invoice) => invoice.tenantId === tenantId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  findByIdempotencyKey(key) {
    return [...this.invoices.values()].find(
      (invoice) => invoice.idempotencyKey === key
    );
  }
}
