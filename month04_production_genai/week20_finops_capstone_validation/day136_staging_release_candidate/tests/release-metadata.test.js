"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const {
  createReleaseMetadata,
} = require("../src/release/release-metadata");

const validInput = {
  version: "1.0.0-rc.1",
  commit: "a".repeat(40),
  environment: "staging",
  artifactDigest: `sha256:${"b".repeat(64)}`,
};

test("creates valid staging release metadata", () => {
  const result = createReleaseMetadata(validInput);

  assert.equal(result.version, "1.0.0-rc.1");
  assert.equal(result.environment, "staging");
  assert.equal(result.commit, validInput.commit);
  assert.ok(Number.isFinite(Date.parse(result.createdAt)));
});

test("rejects an invalid commit SHA", () => {
  assert.throws(
    () =>
      createReleaseMetadata({
        ...validInput,
        commit: "abc123",
      }),
    /40-character Git SHA/
  );
});

test("rejects an unsupported environment", () => {
  assert.throws(
    () =>
      createReleaseMetadata({
        ...validInput,
        environment: "development",
      }),
    /environment must be staging or production/
  );
});

test("rejects an invalid artifact digest", () => {
  assert.throws(
    () =>
      createReleaseMetadata({
        ...validInput,
        artifactDigest: "sha256:invalid",
      }),
    /SHA-256 digest/
  );
});
