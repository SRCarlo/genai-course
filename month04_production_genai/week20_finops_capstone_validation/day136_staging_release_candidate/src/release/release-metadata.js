"use strict";

function createReleaseMetadata({
  version,
  commit,
  environment,
  artifactDigest,
}) {
  if (typeof version !== "string" || !version.trim()) {
    throw new TypeError("version is required");
  }

  if (
    typeof commit !== "string" ||
    !/^[a-f0-9]{40}$/.test(commit)
  ) {
    throw new TypeError(
      "commit must be a full 40-character Git SHA"
    );
  }

  if (!["staging", "production"].includes(environment)) {
    throw new TypeError(
      "environment must be staging or production"
    );
  }

  if (
    typeof artifactDigest !== "string" ||
    !/^sha256:[a-f0-9]{64}$/.test(artifactDigest)
  ) {
    throw new TypeError(
      "artifactDigest must be a SHA-256 digest"
    );
  }

  return Object.freeze({
    version,
    commit,
    environment,
    artifactDigest,
    createdAt: new Date().toISOString(),
  });
}

module.exports = { createReleaseMetadata };
