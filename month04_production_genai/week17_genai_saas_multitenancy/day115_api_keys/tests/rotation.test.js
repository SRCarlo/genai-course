import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { ApiKeyService } from "../src/auth/api-key-service.js";

test("rotation revokes the old key and creates an active new key", async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "day115-"));
  const service = new ApiKeyService({
    filePath: path.join(dir, "api-keys.json")
  });

  const oldKey = await service.create({
    userId: "user-1",
    tenantId: "tenant-a",
    name: "production",
    scopes: ["chat:write"]
  });

  const newKey = await service.rotate({
    keyId: oldKey.id,
    requesterUserId: "user-1",
    requesterTenantId: "tenant-a"
  });

  assert.notEqual(newKey.key, oldKey.key);

  await assert.rejects(
    service.authenticate(oldKey.key),
    /Invalid API key/
  );

  const identity = await service.authenticate(newKey.key);

  assert.equal(identity.keyId, newKey.id);

  const records = await service.load();
  const oldRecord = records.find((item) => item.id === oldKey.id);
  const newRecord = records.find((item) => item.id === newKey.id);

  assert.equal(oldRecord.status, "revoked");
  assert.equal(newRecord.status, "active");
});
