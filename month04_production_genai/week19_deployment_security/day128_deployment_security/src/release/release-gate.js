const REQUIRED_CHECKS = [
  "unitTests",
  "securityTests",
  "dependencyAudit",
  "imageScan",
];

function evaluateRelease(checks) {
  const failures = [];

  for (const name of REQUIRED_CHECKS) {
    if (checks[name] !== true) {
      failures.push({
        check: name,
        reason:
          checks[name] === false
            ? "Check failed"
            : "Check missing or not successful",
      });
    }
  }

  return {
    allowed: failures.length === 0,
    failures,
  };
}

export { REQUIRED_CHECKS, evaluateRelease };
