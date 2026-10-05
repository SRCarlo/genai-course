import test from "node:test";
import assert from "node:assert/strict";
import { ApiKeyService } from "../src/auth/api-key.js";
import { AuthenticationService } from "../src/auth/authentication.js";
import { UserRegistry } from "../src/users/user-registry.js";

test("valid API key authenticates the correct user", () => {
  const service = new AuthenticationService({
    apiKeyService: new ApiKeyService(),
    userRegistry: new UserRegistry(),
  });
  assert.equal(service.authenticate("sk-member").id, "user-003");
});

test("invalid API key is rejected", () => {
  const service = new AuthenticationService({
    apiKeyService: new ApiKeyService(),
    userRegistry: new UserRegistry(),
  });
  assert.throws(() => service.authenticate("sk-invalid"), /Invalid API key/);
});

test("inactive user is rejected", () => {
  const service = new AuthenticationService({
    apiKeyService: new ApiKeyService(),
    userRegistry: new UserRegistry(),
  });
  assert.throws(() => service.authenticate("sk-inactive"), /User is inactive/);
});
