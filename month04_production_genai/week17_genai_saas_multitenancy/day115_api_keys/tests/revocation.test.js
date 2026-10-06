import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { ApiKeyService } from "../src/auth/api-key-service.js";

test("revoked key cannot authenticate", async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "day115-"));
  const service = new ApiKeyService({
    filePath: path.join(dir, "api-keys.json")
  });

  const created = await service.create({
    userId: "user-1",
    tenantId: "tenant-a",
    name: "revocation-test",
    scopes: ["chat:write"]
  });

  await service.revoke(created.id, "tenant-a");

  await assert.rejects(
    service.authenticate(created.key),
    /Invalid API key/
  );
});
