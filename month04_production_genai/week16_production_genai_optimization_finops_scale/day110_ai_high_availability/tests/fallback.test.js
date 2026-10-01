import test from "node:test";
import assert from "node:assert/strict";
import { AIGateway } from "../src/ai/ai-gateway.js";
import {
  createFailingProvider,
  createHealthyProvider,
} from "../src/ai/mock-providers.js";
test("fallback is used when primary fails", async () => {
  const gateway = new AIGateway({
    primary: createFailingProvider("Primary failed"),
    fallback: createHealthyProvider("Fallback worked"),
  });
  const result = await gateway.generate("Hello");
  assert.equal(result.text, "Fallback worked");
  assert.equal(result.provider, "fallback");
  assert.equal(result.fallback, true);
});
