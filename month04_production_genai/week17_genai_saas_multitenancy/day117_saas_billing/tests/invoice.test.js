import test from "node:test";
import assert from "node:assert/strict";

import { InvoiceService } from "../src/billing/invoice.service.js";

test("creates invoice and calculates line-item total", () => {
  const service = new InvoiceService();

  const invoice = service.createInvoice({
    tenantId: "tenant_1",
    subscriptionId: "sub_1",
    periodStart: "2026-10-01T00:00:00.000Z",
    periodEnd: "2026-11-01T00:00:00.000Z"
  });

  service.addInvoiceItem(invoice.id, {
    description: "Pro Plan",
    quantity: 1,
    unitAmountCents: 4_900
  });

  service.addInvoiceItem(invoice.id, {
    description: "AI Token Overage",
    quantity: 3,
    unitAmountCents: 400,
    amountCents: 1_200
  });

  const result = service.calculateInvoiceTotal(invoice.id);

  assert.equal(result.subtotalCents, 6_100);
  assert.equal(result.totalCents, 6_100);
  assert.equal(result.items.length, 2);
});

test("finalizes an invoice", () => {
  const service = new InvoiceService();

  const invoice = service.createInvoice({
    tenantId: "tenant_1",
    subscriptionId: "sub_1",
    periodStart: "2026-10-01",
    periodEnd: "2026-11-01"
  });

  service.addInvoiceItem(invoice.id, {
    description: "Plan",
    quantity: 1,
    unitAmountCents: 4_900
  });

  const finalized = service.finalizeInvoice(invoice.id);

  assert.equal(finalized.status, "open");
});
