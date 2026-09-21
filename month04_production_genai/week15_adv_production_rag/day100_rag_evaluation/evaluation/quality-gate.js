import { thresholds } from "./thresholds.js";

export function runQualityGate(metrics) {
  const failures = [];

  if (metrics.recallAt5 < thresholds.recallAt5) {
    failures.push("recallAt5");
  }

  if (metrics.precisionAt5 < thresholds.precisionAt5) {
    failures.push("precisionAt5");
  }

  if (metrics.faithfulness < thresholds.faithfulness) {
    failures.push("faithfulness");
  }

  if (metrics.answerRelevance < thresholds.answerRelevance) {
    failures.push("answerRelevance");
  }

  return {
    passed: failures.length === 0,
    failures,
  };
}
