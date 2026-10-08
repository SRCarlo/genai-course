import test from "node:test";
import assert from "node:assert/strict";

import { calculateUsageCharge } from "../src/pricing/pricing.engine.js";

test("calculates zero overage when usage is included", () => {
  const result = calculateUsageCharge({
    usedTokens: 5_000_000,
    includedTokens: 10_000_000,
    pricePerMillionCents: 400
  });

  assert.equal(result.overageTokens, 0);
  assert.equal(result.overageCents, 0);
});

test("calculates 3M token overage at $4/M", () => {
  const result = calculateUsageCharge({
    usedTokens: 13_000_000,
    includedTokens: 10_000_000,
    pricePerMillionCents: 400
  });

  assert.equal(result.overageTokens, 3_000_000);
  assert.equal(result.overageCents, 1_200);
});

test("supports fractional million-token overage", () => {
  const result = calculateUsageCharge({
    usedTokens: 10_500_000,
    includedTokens: 10_000_000,
    pricePerMillionCents: 400
  });

  assert.equal(result.overageCents, 200);
});
