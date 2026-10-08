export function calculateUsageCharge({
  usedTokens,
  includedTokens,
  pricePerMillionCents
}) {
  validateNonNegativeInteger(usedTokens, "usedTokens");
  validateNonNegativeInteger(includedTokens, "includedTokens");
  validateNonNegativeInteger(pricePerMillionCents, "pricePerMillionCents");

  const overageTokens = Math.max(usedTokens - includedTokens, 0);

  // Exact integer-cent calculation:
  // round(overageTokens * centsPerMillion / 1,000,000)
  const numerator =
    BigInt(overageTokens) * BigInt(pricePerMillionCents);

  const overageCents = Number(
    (numerator + 500_000n) / 1_000_000n
  );

  return {
    usedTokens,
    includedTokens,
    overageTokens,
    overageCents
  };
}

function validateNonNegativeInteger(value, name) {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new Error(`INVALID_${name.toUpperCase()}`);
  }
}
