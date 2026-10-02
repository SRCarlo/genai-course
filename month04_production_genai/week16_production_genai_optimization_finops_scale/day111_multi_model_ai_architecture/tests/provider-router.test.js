import test from "node:test";
import assert from "node:assert/strict";

import { ProviderRouter } from "../src/router/provider-router.js";
import { ProviderA } from "../src/providers/provider-a.js";
import { ProviderB } from "../src/providers/provider-b.js";
import { ProviderC } from "../src/providers/provider-c.js";

test("provider-a exists", () => {
  const router = new ProviderRouter({
    "provider-a": new ProviderA({ apiKey: null }),
    "provider-b": new ProviderB(),
    "provider-c": new ProviderC()
  });

  assert.equal(router.get("provider-a").name, "provider-a");
});

test("provider-b exists", () => {
  const router = new ProviderRouter({
    "provider-a": new ProviderA({ apiKey: null }),
    "provider-b": new ProviderB(),
    "provider-c": new ProviderC()
  });

  assert.equal(router.get("provider-b").name, "provider-b");
});

test("provider-c exists", () => {
  const router = new ProviderRouter({
    "provider-a": new ProviderA({ apiKey: null }),
    "provider-b": new ProviderB(),
    "provider-c": new ProviderC()
  });

  assert.equal(router.get("provider-c").name, "provider-c");
});

test("unknown provider throws", () => {
  const router = new ProviderRouter({});

  assert.throws(
    () => router.get("unknown"),
    /Provider not found/
  );
});
