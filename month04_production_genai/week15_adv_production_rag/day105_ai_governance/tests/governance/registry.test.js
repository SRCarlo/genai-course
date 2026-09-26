import test from "node:test";
import assert from "node:assert/strict";
import {
  registerAISystem,
  getAISystems,
  getAISystem
} from "../../src/governance/ai-registry.js";

test("registers and retrieves an AI system", () => {
  const system = registerAISystem({
    systemId: "TEST-AI-001",
    name: "Test Assistant",
    owner: "Test Team"
  });

  assert.equal(system.systemId, "TEST-AI-001");
  assert.equal(getAISystem("TEST-AI-001").name, "Test Assistant");
  assert.ok(getAISystems().length >= 1);
});
