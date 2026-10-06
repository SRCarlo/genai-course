import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { ApiKeyService } from "../src/auth/api-key-service.js";

async function createService() {
  const dir = await fs.mkdtemp(
    path.join(os.tmpdir(), "day115-")
  );

  return new ApiKeyService({
    filePath: path.join(dir, "api-keys.json")
  });
}

test("generates, hashes and authenticates a key", async () => {
  const service = await createService();

  const created = await service.create({
    userId: "user-1",
    tenantId: "tenant-a",
    name: "test",
    scopes: ["chat:write"]
  });

  assert.match(created.key, /^sk_live_[a-f0-9]{64}$/);

  const records = await service.load();

  assert.equal(records.length, 1);
  assert.notEqual(records[0].keyHash, created.key);
  assert.equal(records[0].prefix, created.key.slice(0, 16));

  const identity = await service.authenticate(created.key);

  assert.equal(identity.userId, "user-1");
  assert.equal(identity.tenantId, "tenant-a");
  assert.deepEqual(identity.scopes, ["chat:write"]);
});

test("invalid key is rejected", async () => {
  const service = await createService();

  await assert.rejects(
    service.authenticate("sk_live_invalid"),
    /Invalid API key/
  );
});

test("list never exposes the full API key", async () => {
  const service = await createService();

  const created = await service.create({
    userId: "user-1",
    tenantId: "tenant-a",
    name: "test",
    scopes: ["usage:read"]
  });

  const list = await service.listByTenant("tenant-a");

  assert.equal(list.length, 1);
  assert.equal("key" in list[0], false);
  assert.equal("keyHash" in list[0], false);
  assert.equal(list[0].prefix, created.prefix);
});
