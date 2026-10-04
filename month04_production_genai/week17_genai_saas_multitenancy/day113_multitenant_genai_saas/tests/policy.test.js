import test from "node:test";
import assert from "node:assert/strict";

import { TenantPolicy } from "../src/tenants/tenant-policy.js";
import { ModelPolicy } from "../src/models/model-policy.js";

test("free plan can use fast", () => {
  const policy = new TenantPolicy();
  const models = new ModelPolicy();

  assert.doesNotThrow(() => {
    models.validate(policy.get("free"), "fast");
  });
});

test("free plan cannot use balanced", () => {
  const policy = new TenantPolicy();
  const models = new ModelPolicy();

  assert.throws(
    () => models.validate(policy.get("free"), "balanced"),
    /not allowed/
  );
});

test("enterprise plan can use quality", () => {
  const policy = new TenantPolicy();
  const models = new ModelPolicy();

  assert.doesNotThrow(() => {
    models.validate(policy.get("enterprise"), "quality");
  });
});