import test from "node:test";
import assert from "node:assert/strict";

import { TenantRAG } from "../src/rag/tenant-rag.js";
import { TenantCache } from "../src/cache/tenant-cache.js";

test("Tenant A cannot retrieve Tenant B documents", () => {
  const rag = new TenantRAG([
    {
      id: "a1",
      tenantId: "tenant-acme",
      text: "Acme has 500 employees"
    },
    {
      id: "b1",
      tenantId: "tenant-beta",
      text: "Beta Labs has 80 employees"
    }
  ]);

  const result = rag.search(
    "tenant-acme",
    "Beta Labs"
  );

  assert.equal(result.length, 0);
});

test("Tenant B cannot retrieve Tenant A documents", () => {
  const rag = new TenantRAG([
    {
      id: "a1",
      tenantId: "tenant-acme",
      text: "Acme has 500 employees"
    },
    {
      id: "b1",
      tenantId: "tenant-beta",
      text: "Beta Labs has 80 employees"
    }
  ]);

  const result = rag.search(
    "tenant-beta",
    "Acme"
  );

  assert.equal(result.length, 0);
});

test("same prompt has different cache keys for different tenants", () => {
  const cache = new TenantCache();

  const keyA = cache.createKey({
    tenantId: "tenant-acme",
    model: "fast",
    prompt: "Explain our policy"
  });

  const keyB = cache.createKey({
    tenantId: "tenant-beta",
    model: "fast",
    prompt: "Explain our policy"
  });

  assert.notEqual(keyA, keyB);
});

test("Tenant A cannot read Tenant B cached value", () => {
  const cache = new TenantCache();

  cache.set(
    {
      tenantId: "tenant-beta",
      model: "fast",
      prompt: "Explain our policy"
    },
    "Beta response"
  );

  const valueForAcme = cache.get({
    tenantId: "tenant-acme",
    model: "fast",
    prompt: "Explain our policy"
  });

  assert.equal(valueForAcme, undefined);
});