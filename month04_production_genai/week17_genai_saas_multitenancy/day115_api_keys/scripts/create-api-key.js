import "dotenv/config";

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { ApiKeyService } from "../src/auth/api-key-service.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, "..");
const dataDir = path.resolve(
  projectRoot,
  process.env.DATA_DIR || "./data"
);

const service = new ApiKeyService({
  filePath: path.join(dataDir, "api-keys.json")
});

const result = await service.create({
  userId: "user-demo",
  tenantId: "tenant-acme",
  name: "Day 115 local development",
  scopes: [
    "chat:write",
    "usage:read"
  ]
});

const keyFile = path.join(projectRoot, ".local-api-key");

await fs.writeFile(
  keyFile,
  `${result.key}\n`,
  {
    encoding: "utf8",
    mode: 0o600
  }
);

console.log(`Created API key: ${result.id}`);
console.log(`Saved plaintext credential to ${path.basename(keyFile)}.`);
console.log(`Prefix: ${result.prefix}`);
console.log(`Scopes: ${result.scopes.join(", ")}`);
