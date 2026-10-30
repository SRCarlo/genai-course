"use strict";

const REQUIRED_CHECKS = Object.freeze([
  "unitTests",
  "integrationTests",
  "securityScan",
  "aiEvaluation",
  "stagingSmokeTests",
]);

function evaluateRelease(input) {
  if (!input || typeof input !== "object") {
    throw new TypeError("Release input must be an object");
  }

  const {
    environment,
    checks,
    canaryDecision,
    approval,
    alreadyDeployed = false,
  } = input;

  if (!["staging", "production"].includes(environment)) {
    throw new Error("Invalid deployment environment");
  }

  if (alreadyDeployed && canaryDecision === "ROLLBACK") {
    return {
      decision: "ROLLBACK",
      reasons: ["Canary policy requested rollback"],
    };
  }

  if (!checks || typeof checks !== "object" || Array.isArray(checks)) {
    return {
      decision: "HOLD",
      reasons: ["Release check evidence is missing"],
    };
  }

  const missing = REQUIRED_CHECKS.filter(
    (key) => typeof checks[key] !== "boolean"
  );

  if (missing.length > 0) {
    return {
      decision: "HOLD",
      reasons: [
        `Missing or invalid checks: ${missing.join(", ")}`,
      ],
    };
  }

  const failed = REQUIRED_CHECKS.filter(
    (key) => checks[key] === false
  );

  if (failed.length > 0) {
    return {
      decision: "BLOCK",
      reasons: failed.map((key) => `${key} failed`),
    };
  }

  if (environment === "production") {
    if (canaryDecision === "ROLLBACK") {
      return {
        decision: "BLOCK",
        reasons: [
          "Candidate has a rollback signal but is not marked deployed",
        ],
      };
    }

    if (canaryDecision !== "PROMOTE") {
      return {
        decision: "HOLD",
        reasons: [
          "Production requires a PROMOTE canary decision",
        ],
      };
    }

    if (!approval || typeof approval !== "object") {
      return {
        decision: "HOLD",
        reasons: ["Production approval is missing"],
      };
    }

    if (
      approval.approved !== true ||
      typeof approval.approverId !== "string" ||
      approval.approverId.trim().length === 0
    ) {
      return {
        decision: "HOLD",
        reasons: [
          "Valid production approval is required",
        ],
      };
    }
  }

  return {
    decision: "APPROVE",
    reasons: [
      `All required ${environment} release gates passed`,
    ],
  };
}

module.exports = {
  REQUIRED_CHECKS,
  evaluateRelease,
};
