import test from "node:test";
import assert from "node:assert/strict";
import { retrieveSecureDocuments } from "../../src/ai/retrieval/secure-retrieval.js";

test("tenant A cannot retrieve tenant B documents", () => {
  const results = retrieveSecureDocuments({
    user: { id: "user-a1", tenantId: "tenant-a" },
    query: "20 days leave",
  });

  assert.equal(
    results.some((doc) => doc.tenantId === "tenant-b"),
    false,
  );
});
