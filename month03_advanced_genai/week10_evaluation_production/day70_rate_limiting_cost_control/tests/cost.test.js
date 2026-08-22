import test from "node:test";
import assert from "node:assert/strict";

import { calculateCost } from "../src/utils/pricing.js";

test("calculates token cost correctly", () => {
  const cost = calculateCost({
    inputTokens: 100_000,

    outputTokens: 20_000,

    inputPricePerMillion: 1,

    outputPricePerMillion: 3,
  });

  assert.equal(cost, 0.16);
});
