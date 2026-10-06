import crypto from "node:crypto";
import { generateApiKey, getApiKeyPrefix } from "./api-key-generator.js";
import { hashApiKey } from "./api-key-hasher.js";
import { readJson, writeJson } from "../storage/json-store.js";

const ALLOWED_SCOPES = new Set([
  "chat:read",
  "chat:write",
  "rag:read",
  "rag:write",
  "agents:run",
  "usage:read",
]);

export class ApiKeyService {
  constructor({ filePath }) {
    this.filePath = filePath;
  }

  async load() {
    return readJson(this.filePath, []);
  }

  async save(records) {
    await writeJson(this.filePath, records);
  }

  validateScopes(scopes) {
    if (!Array.isArray(scopes) || scopes.length === 0) {
      throw new Error("At least one API-key scope is required");
    }

    const uniqueScopes = [...new Set(scopes)];

    for (const scope of uniqueScopes) {
      if (!ALLOWED_SCOPES.has(scope)) {
        throw new Error(`Unsupported scope: ${scope}`);
      }
    }

    return uniqueScopes;
  }

  async create({ userId, tenantId, name, scopes, expiresAt = null }) {
    if (!userId || !tenantId || !name) {
      throw new Error("userId, tenantId and name are required");
    }

    const normalizedScopes = this.validateScopes(scopes);

    if (expiresAt !== null && Number.isNaN(Date.parse(expiresAt))) {
      throw new Error("expiresAt must be a valid ISO date or null");
    }

    const apiKey = generateApiKey();
    const keyId = `key_${crypto.randomUUID()}`;
    const now = new Date().toISOString();

    const record = {
      id: keyId,
      userId,
      tenantId,
      name,
      prefix: getApiKeyPrefix(apiKey),
      keyHash: hashApiKey(apiKey),
      scopes: normalizedScopes,
      status: "active",
      createdAt: now,
      expiresAt,
      revokedAt: null,
      lastUsedAt: null,
    };

    const records = await this.load();
    records.push(record);
    await this.save(records);

    return {
      id: record.id,
      key: apiKey,
      name: record.name,
      prefix: record.prefix,
      scopes: record.scopes,
      status: record.status,
      expiresAt: record.expiresAt,
    };
  }

  async authenticate(apiKey) {
    if (!apiKey || typeof apiKey !== "string") {
      throw new Error("Invalid API key");
    }

    const keyHash = hashApiKey(apiKey);
    const records = await this.load();

    const record = records.find((item) =>
      crypto.timingSafeEqual(
        Buffer.from(item.keyHash, "hex"),
        Buffer.from(keyHash, "hex"),
      ),
    );

    if (!record) {
      throw new Error("Invalid API key");
    }

    if (record.status !== "active") {
      throw new Error("Invalid API key");
    }

    if (record.expiresAt && new Date(record.expiresAt) <= new Date()) {
      record.status = "expired";
      await this.save(records);
      throw new Error("API key expired");
    }

    record.lastUsedAt = new Date().toISOString();
    await this.save(records);

    return {
      keyId: record.id,
      userId: record.userId,
      tenantId: record.tenantId,
      scopes: [...record.scopes],
    };
  }

  async revoke(keyId, requesterTenantId) {
    const records = await this.load();
    const record = records.find((item) => item.id === keyId);

    if (!record || record.tenantId !== requesterTenantId) {
      throw new Error("API key not found");
    }

    if (record.status !== "revoked") {
      record.status = "revoked";
      record.revokedAt = new Date().toISOString();
      await this.save(records);
    }

    return this.toSafeRecord(record);
  }

  async rotate({ keyId, requesterUserId, requesterTenantId }) {
    const records = await this.load();
    const oldRecord = records.find((item) => item.id === keyId);

    if (
      !oldRecord ||
      oldRecord.tenantId !== requesterTenantId ||
      oldRecord.userId !== requesterUserId
    ) {
      throw new Error("API key not found");
    }

    if (oldRecord.status !== "active") {
      throw new Error("Only an active API key can be rotated");
    }

    oldRecord.status = "revoked";
    oldRecord.revokedAt = new Date().toISOString();
    await this.save(records);

    return this.create({
      userId: oldRecord.userId,
      tenantId: oldRecord.tenantId,
      name: oldRecord.name,
      scopes: oldRecord.scopes,
      expiresAt: oldRecord.expiresAt,
    });
  }

  async listByTenant(tenantId) {
    const records = await this.load();

    return records
      .filter((item) => item.tenantId === tenantId)
      .map((item) => this.toSafeRecord(item));
  }

  async getById(keyId, tenantId) {
    const records = await this.load();

    const record = records.find(
      (item) => item.id === keyId && item.tenantId === tenantId,
    );

    return record ? this.toSafeRecord(record) : null;
  }

  toSafeRecord(record) {
    return {
      id: record.id,
      tenantId: record.tenantId,
      userId: record.userId,
      name: record.name,
      prefix: record.prefix,
      scopes: [...record.scopes],
      status: record.status,
      createdAt: record.createdAt,
      expiresAt: record.expiresAt,
      revokedAt: record.revokedAt,
      lastUsedAt: record.lastUsedAt,
    };
  }
}

export { ALLOWED_SCOPES };
