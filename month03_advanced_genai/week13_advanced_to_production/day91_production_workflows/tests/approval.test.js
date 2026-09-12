import test from "node:test";
import assert from "node:assert/strict";

import { evaluateRefundPolicy } from "../src/approval/approval.policy.js";

test("requires approval above threshold", () => {
  const result = evaluateRefundPolicy(
    { eligible: true, amount: 20000 },
    { action: "request_refund" },
    { threshold: 10000 }
  );

  assert.equal(result.eligible, true);
  assert.equal(result.approvalRequired, true);
});

test("does not require approval below threshold", () => {
  const result = evaluateRefundPolicy(
    { eligible: true, amount: 5000 },
    { action: "request_refund" },
    { threshold: 10000 }
  );

  assert.equal(result.approvalRequired, false);
});
