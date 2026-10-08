import { calculateUsageCharge } from "../pricing/pricing.engine.js";

export class UsageBillingService {
  calculate({
    basePriceCents,
    usedTokens,
    includedTokens,
    pricePerMillionCents
  }) {
    const usage = calculateUsageCharge({
      usedTokens,
      includedTokens,
      pricePerMillionCents
    });

    return {
      basePriceCents,
      usageChargeCents: usage.overageCents,
      subtotalCents: basePriceCents + usage.overageCents,
      usage
    };
  }
}
