import test from "node:test";
import assert from "node:assert/strict";
import {
  requiredTermsCheck,
  forbiddenTermsCheck,
  refusalCheck,
  toolCheck,
  toolArgumentsCheck
} from "../src/evaluation/rules.js";

test("required terms pass", () => {
  assert.equal(
    requiredTermsCheck("Node.js is a JavaScript runtime.", ["JavaScript", "runtime"]),
    true
  );
});

test("forbidden terms fail when present", () => {
  assert.equal(
    forbiddenTermsCheck("This contains secret data.", ["secret"]),
    false
  );
});

test("refusal check", () => {
  assert.equal(refusalCheck("I cannot help with that request.", true), true);
});

test("tool selection check", () => {
  assert.equal(
    toolCheck([{ name: "getOrderStatus", arguments: { orderId: "1" } }], "getOrderStatus"),
    true
  );
});

test("tool argument check", () => {
  assert.equal(
    toolArgumentsCheck(
      [{ name: "getOrderStatus", arguments: { orderId: "1" } }],
      "getOrderStatus",
      { orderId: "1" }
    ),
    true
  );
});
