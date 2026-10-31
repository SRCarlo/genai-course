"use strict";

const REQUIRED_STAGES = Object.freeze([
  "audit",
  "staging",
  "canary",
  "releasePolicy",
]);

const VALID_STATUSES = new Set([
  "PASSED",
  "FAILED",
  "MISSING",
]);

function verifyRelease(evidence) {
  if (
    !evidence ||
    typeof evidence !== "object" ||
    Array.isArray(evidence)
  ) {
    throw new TypeError("Evidence must be an object");
  }

  const reasons = [];
  const candidate = evidence.candidate;

  if (
    !candidate ||
    typeof candidate.version !== "string" ||
    candidate.version.trim() === "" ||
    typeof candidate.artifactDigest !== "string" ||
    !/^sha256:[a-f0-9]{64}$/.test(candidate.artifactDigest)
  ) {
    return {
      status: "BLOCKED",
      reasons: ["Candidate identity is missing or invalid"],
      deploymentAuthorized: false,
    };
  }

  const missingStages = REQUIRED_STAGES.filter(
    (stage) =>
      !evidence[stage] ||
      typeof evidence[stage] !== "object"
  );

  if (missingStages.length > 0) {
    return {
      status: "HOLD",
      reasons: [
        `Missing stages: ${missingStages.join(", ")}`,
      ],
      deploymentAuthorized: false,
    };
  }

  const rollbackRequired =
    evidence.canary.decision === "ROLLBACK";

  if (
    rollbackRequired &&
    evidence.canary.alreadyDeployed === true
  ) {
    return {
      status: "ROLLBACK_REQUIRED",
      reasons: [
        "Deployed candidate has a canary rollback signal",
      ],
      deploymentAuthorized: false,
    };
  }

  const failedStages = [];
  const missingEvidence = [];

  for (const stage of REQUIRED_STAGES) {
    const result = evidence[stage];

    if (!VALID_STATUSES.has(result.status)) {
      missingEvidence.push(
        `${stage}: invalid or missing status`
      );
      continue;
    }

    if (result.status === "FAILED") {
      failedStages.push(stage);
    }

    if (result.status === "MISSING") {
      missingEvidence.push(stage);
    }

    if (
      result.artifactDigest !== candidate.artifactDigest
    ) {
      failedStages.push(
        `${stage}: artifact digest mismatch`
      );
    }

    if (
      typeof result.sourceId !== "string" ||
      result.sourceId.trim() === ""
    ) {
      missingEvidence.push(
        `${stage}: missing evidence source ID`
      );
    }
  }

  if (failedStages.length > 0) {
    return {
      status: "BLOCKED",
      reasons: failedStages.map(
        (stage) => `${stage} failed verification`
      ),
      deploymentAuthorized: false,
    };
  }

  if (missingEvidence.length > 0) {
    return {
      status: "HOLD",
      reasons: missingEvidence,
      deploymentAuthorized: false,
    };
  }

  if (evidence.canary.decision !== "PROMOTE") {
    return {
      status: "HOLD",
      reasons: ["Canary is not approved for promotion"],
      deploymentAuthorized: false,
    };
  }

  if (evidence.releasePolicy.decision !== "APPROVE") {
    return {
      status: "HOLD",
      reasons: [
        "Release policy has not approved the candidate",
      ],
      deploymentAuthorized: false,
    };
  }

  return {
    status: "READY_FOR_APPROVAL",
    reasons: [
      "All supplied release evidence passed verification",
      "Final deployment authorization remains separate",
    ],
    deploymentAuthorized: false,
    candidate: {
      version: candidate.version,
      artifactDigest: candidate.artifactDigest,
    },
    verifiedStages: [...REQUIRED_STAGES],
  };
}

module.exports = {
  REQUIRED_STAGES,
  verifyRelease,
};
