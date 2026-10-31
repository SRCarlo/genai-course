"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const {
  REQUIRED_STAGES,
  verifyRelease,
} = require("../src/verification/release-verifier");

const digest = `sha256:${"a".repeat(64)}`;

function createEvidence() {
  const evidence = {
    candidate: {
      version: "1.0.0-rc.3",
      artifactDigest: digest,
    },
    canary: {
      decision: "PROMOTE",
      alreadyDeployed: false,
    },
    releasePolicy: {
      decision: "APPROVE",
    },
  };

  for (const stage of REQUIRED_STAGES) {
    evidence[stage] = {
      status: "PASSED",
      artifactDigest: digest,
      sourceId: `${stage}-run-001`,
    };
  }

  evidence.canary.decision = "PROMOTE";
  evidence.canary.alreadyDeployed = false;
  evidence.releasePolicy.decision = "APPROVE";

  return evidence;
}

test("verifies a complete candidate", () => {
  const result = verifyRelease(createEvidence());

  assert.equal(result.status, "READY_FOR_APPROVAL");
  assert.equal(result.deploymentAuthorized, false);
});

test("holds when a stage is missing", () => {
  const evidence = createEvidence();
  delete evidence.audit;

  assert.equal(
    verifyRelease(evidence).status,
    "HOLD"
  );
});

test("blocks when audit fails", () => {
  const evidence = createEvidence();
  evidence.audit.status = "FAILED";

  assert.equal(
    verifyRelease(evidence).status,
    "BLOCKED"
  );
});

test("blocks when artifact digests do not match", () => {
  const evidence = createEvidence();
  evidence.staging.artifactDigest =
    `sha256:${"b".repeat(64)}`;

  assert.equal(
    verifyRelease(evidence).status,
    "BLOCKED"
  );
});

test("holds when evidence source ID is missing", () => {
  const evidence = createEvidence();
  evidence.audit.sourceId = "";

  assert.equal(
    verifyRelease(evidence).status,
    "HOLD"
  );
});

test("holds when canary is not promoted", () => {
  const evidence = createEvidence();
  evidence.canary.decision = "HOLD";

  assert.equal(
    verifyRelease(evidence).status,
    "HOLD"
  );
});

test("holds when release policy has not approved", () => {
  const evidence = createEvidence();
  evidence.releasePolicy.decision = "HOLD";

  assert.equal(
    verifyRelease(evidence).status,
    "HOLD"
  );
});

test("requires rollback for a deployed candidate", () => {
  const evidence = createEvidence();
  evidence.canary.decision = "ROLLBACK";
  evidence.canary.alreadyDeployed = true;

  assert.equal(
    verifyRelease(evidence).status,
    "ROLLBACK_REQUIRED"
  );
});

test("blocks invalid artifact digest", () => {
  const evidence = createEvidence();
  evidence.candidate.artifactDigest = "invalid";

  assert.equal(
    verifyRelease(evidence).status,
    "BLOCKED"
  );
});

test("rejects null input", () => {
  assert.throws(
    () => verifyRelease(null),
    /Evidence must be an object/
  );
});

test("does not authorize deployment automatically", () => {
  const result = verifyRelease(createEvidence());

  assert.equal(result.deploymentAuthorized, false);
});

