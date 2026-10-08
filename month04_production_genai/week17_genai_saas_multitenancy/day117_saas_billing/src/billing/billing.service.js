export class BillingService {
  constructor({
    customerService,
    subscriptionService,
    entitlementService,
    usageRepository,
    usageBillingService,
    invoiceService,
    paymentService
  }) {
    this.customerService = customerService;
    this.subscriptionService = subscriptionService;
    this.entitlementService = entitlementService;
    this.usageRepository = usageRepository;
    this.usageBillingService = usageBillingService;
    this.invoiceService = invoiceService;
    this.paymentService = paymentService;
  }

  processEvent(event) {
    switch (event.type) {
      case "invoice.paid":
        return this.invoiceService.markPaid(event.data.invoiceId);

      case "payment.failed":
        return this.invoiceService.markPaymentFailed(event.data.invoiceId);

      case "subscription.updated":
        return this.subscriptionService.getById(event.data.subscriptionId);

      case "subscription.cancelled": {
        const subscription = this.subscriptionService.getById(
          event.data.subscriptionId
        );
        if (subscription) {
          subscription.status = "cancelled";
          subscription.updatedAt = new Date().toISOString();
        }
        return subscription;
      }

      default:
        return { ignored: true, type: event.type };
    }
  }

  async generateInvoiceForTenant(tenantId) {
    const subscription = this.subscriptionService.getSubscription(tenantId);
    if (!subscription) throw new Error("SUBSCRIPTION_NOT_FOUND");

    const plan = this.entitlementService.getPlan(subscription.planId);
    const usage = this.usageRepository.aggregate(
      tenantId,
      subscription.currentPeriodStart,
      subscription.currentPeriodEnd
    );

    const billing = this.usageBillingService.calculate({
      basePriceCents: plan.monthlyPriceCents,
      usedTokens: usage.totalTokens,
      includedTokens: plan.entitlements.monthlyTokens,
      pricePerMillionCents: plan.overagePricePerMillionCents
    });

    const invoice = this.invoiceService.createInvoice({
      tenantId,
      subscriptionId: subscription.id,
      periodStart: subscription.currentPeriodStart,
      periodEnd: subscription.currentPeriodEnd,
      currency: plan.currency,
      idempotencyKey:
        `invoice:${subscription.id}:${subscription.currentPeriodStart}`
    });

    if (invoice.items.length === 0) {
      this.invoiceService.addInvoiceItem(invoice.id, {
        description: `${plan.name} Plan`,
        quantity: 1,
        unitAmountCents: plan.monthlyPriceCents
      });

      if (billing.usage.overageTokens > 0) {
        this.invoiceService.addInvoiceItem(invoice.id, {
          description: "AI Token Overage",
          quantity: billing.usage.overageTokens / 1_000_000,
          unitAmountCents: plan.overagePricePerMillionCents,
          amountCents: billing.usageChargeCents
        });
      }
    }

    this.invoiceService.calculateInvoiceTotal(invoice.id);
    return { invoice, usage, billing };
  }

  async payInvoice(tenantId, invoiceId) {
    const invoice = this.invoiceService.getById(invoiceId);

    if (invoice.tenantId !== tenantId) {
      throw new Error("INVOICE_ACCESS_DENIED");
    }

    if (invoice.status === "paid") return invoice;

    const customer = this.customerService.getByTenant(tenantId);
    if (!customer) throw new Error("CUSTOMER_NOT_FOUND");

    if (invoice.status === "draft") {
      this.invoiceService.finalizeInvoice(invoice.id);
    }

    const payment = await this.paymentService.createPayment({
      customerId: customer.id,
      invoiceId: invoice.id,
      amountCents: invoice.totalCents,
      currency: invoice.currency,
      idempotencyKey: `payment:${invoice.id}`
    });

    if (payment.status === "succeeded") {
      this.invoiceService.markPaid(invoice.id);
    }

    return this.invoiceService.getById(invoice.id);
  }
}
