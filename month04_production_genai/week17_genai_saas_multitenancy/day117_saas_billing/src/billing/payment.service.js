import crypto from "node:crypto";

export class PaymentService {
  constructor() {
    this.payments = new Map();
    this.byIdempotencyKey = new Map();
  }

  async createPayment({
    customerId,
    invoiceId,
    amountCents,
    currency = "USD",
    idempotencyKey
  }) {
    if (!customerId) throw new Error("CUSTOMER_REQUIRED");
    if (!invoiceId) throw new Error("INVOICE_REQUIRED");
    if (!Number.isSafeInteger(amountCents) || amountCents < 0) {
      throw new Error("INVALID_PAYMENT_AMOUNT");
    }

    if (idempotencyKey && this.byIdempotencyKey.has(idempotencyKey)) {
      return this.payments.get(this.byIdempotencyKey.get(idempotencyKey));
    }

    const payment = {
      id: `pay_${crypto.randomUUID()}`,
      customerId,
      invoiceId,
      amountCents,
      currency,
      status: "succeeded",
      idempotencyKey: idempotencyKey ?? null,
      createdAt: new Date().toISOString()
    };

    this.payments.set(payment.id, payment);

    if (idempotencyKey) {
      this.byIdempotencyKey.set(idempotencyKey, payment.id);
    }

    return payment;
  }

  getPayment(paymentId) {
    const payment = this.payments.get(paymentId);
    if (!payment) throw new Error("PAYMENT_NOT_FOUND");
    return payment;
  }

  async refundPayment(paymentId, amountCents) {
    const payment = this.getPayment(paymentId);

    if (payment.status !== "succeeded") {
      throw new Error("PAYMENT_NOT_REFUNDABLE");
    }

    const refundAmount = amountCents ?? payment.amountCents;

    if (
      !Number.isSafeInteger(refundAmount) ||
      refundAmount <= 0 ||
      refundAmount > payment.amountCents
    ) {
      throw new Error("INVALID_REFUND_AMOUNT");
    }

    payment.status = "refunded";

    return {
      id: `ref_${crypto.randomUUID()}`,
      paymentId: payment.id,
      amountCents: refundAmount,
      status: "succeeded",
      createdAt: new Date().toISOString()
    };
  }
}
