import crypto from "node:crypto";

function safeEqual(left, right) {
  const a = Buffer.from(left, "utf8");
  const b = Buffer.from(right, "utf8");

  if (a.length !== b.length) {
    return false;
  }

  return crypto.timingSafeEqual(a, b);
}

export class ApiKeyService {
  constructor(records = []) {
    this.apiKeys = new Map(
      records
        .filter((record) => record?.key)
        .map((record) => [record.key, {
          tenantId: record.tenantId,
          userId: record.userId,
          active: record.active ?? true,
          role: record.role ?? "member"
        }])
    );
  }

  authenticate(apiKey) {
    if (!apiKey) {
      throw new Error("Missing API key");
    }

    for (const [storedKey, record] of this.apiKeys.entries()) {
      if (safeEqual(storedKey, apiKey)) {
        if (!record.active) {
          throw new Error("API key is disabled");
        }

        return { ...record };
      }
    }

    throw new Error("Invalid API key");
  }

  revoke(apiKey) {
    const record = this.apiKeys.get(apiKey);

    if (!record) {
      throw new Error("API key not found");
    }

    this.apiKeys.set(apiKey, { ...record, active: false });
  }

  listForTenant(tenantId) {
    return [...this.apiKeys.entries()]
      .filter(([, record]) => record.tenantId === tenantId)
      .map(([key, record]) => ({
        keyId: crypto.createHash("sha256").update(key).digest("hex").slice(0, 16),
        active: record.active,
        userId: record.userId,
        role: record.role
      }));
  }
}
