import { describe, expect, it } from "vitest";
import { getDocumentForUser } from "../../src/security/tenant-isolation.js";

describe("tenant isolation", () => {
  it("allows same-tenant access", () => {
    const result = getDocumentForUser(
      { tenantId: "tenant-a" },
      "A-1"
    );

    expect(result.allowed).toBe(true);
  });

  it("denies cross-tenant access", () => {
    const result = getDocumentForUser(
      { tenantId: "tenant-a" },
      "B-1"
    );

    expect(result.allowed).toBe(false);
    expect(result.reason).toBe("TENANT_ACCESS_DENIED");
  });
});
