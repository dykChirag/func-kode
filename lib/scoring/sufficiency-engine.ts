import type { DeveloperMetrics, SufficiencyResult } from "./scoring-types";
import { SUFFICIENCY_THRESHOLDS } from "./scoring-types";

/**
 * Determines whether a developer has enough contribution data to compute
 * a meaningful trust score.
 *
 * v1 thresholds:
 *   - at least 3 PRs in the last 90 days
 *   - at least 1 merged PR
 *   - last PR was within the last 90 days
 *
 * These thresholds are defined in SUFFICIENCY_THRESHOLDS and can be bumped
 * by incrementing SCORE_VERSION in scoring-types.ts.
 */
export function checkSufficiency(metrics: DeveloperMetrics): SufficiencyResult {
  const { min_total_prs, min_merged_prs, max_days_since_last_pr } =
    SUFFICIENCY_THRESHOLDS;

  const min_prs = metrics.total_prs >= min_total_prs;
  const has_merged = metrics.merged_prs >= min_merged_prs;
  const recency =
    metrics.days_since_last_pr !== null &&
    metrics.days_since_last_pr <= max_days_since_last_pr;

  const sufficient = min_prs && has_merged && recency;

  let reason: string | null = null;

  if (!sufficient) {
    const missing: string[] = [];

    if (!min_prs) {
      const remaining = min_total_prs - metrics.total_prs;
      missing.push(
        `${remaining} more PR${remaining > 1 ? "s" : ""} needed (minimum ${min_total_prs})`
      );
    }

    if (!has_merged) {
      missing.push("at least 1 merged PR required");
    }

    if (!recency) {
      if (metrics.days_since_last_pr === null) {
        missing.push("no PR activity found");
      } else {
        missing.push(
          `last PR was ${metrics.days_since_last_pr} days ago — contribute within the last ${max_days_since_last_pr} days`
        );
      }
    }

    reason = missing.join("; ");
  }

  return {
    sufficient,
    checks: { min_prs, has_merged, recency },
    reason,
  };
}
