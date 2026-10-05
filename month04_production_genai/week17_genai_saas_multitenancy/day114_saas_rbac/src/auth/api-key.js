import { createHash } from "node:crypto";

const hashKey = (value) => createHash("sha256").update(value).digest("hex");

const demoKeys = [
  ["sk-owner", "user-001"],
  ["sk-admin", "user-002"],
  ["sk-member", "user-003"],
  ["sk-viewer", "user-004"],
  ["sk-beta-member", "user-005"],
  ["sk-beta-viewer", "user-006"],
  ["sk-inactive", "user-007"],
];

export class ApiKeyService {
  constructor() {
    this.keys = new Map(
      demoKeys.map(([key, userId]) => [hashKey(key), { userId, active: true }]),
    );
  }

  authenticate(rawApiKey) {
    if (!rawApiKey) throw new Error("Invalid API key");
    const record = this.keys.get(hashKey(rawApiKey));
    if (!record || !record.active) throw new Error("Invalid API key");
    return { userId: record.userId };
  }

  revoke(rawApiKey) {
    const hash = hashKey(rawApiKey);
    const record = this.keys.get(hash);
    if (!record) return false;
    record.active = false;
    return true;
  }
}
