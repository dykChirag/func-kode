/**
 * Scoring types for Patch ID developer trust score.
 *
 * DeveloperMetrics   — raw aggregated numbers from pr_events (last 90 days)
 * SufficiencyResult  — whether enough data exists to compute a meaningful score
 * DeveloperScore     — final 0-100 score with per-dimension breakdown
 */

export interface DeveloperMetrics {
  developer_id: string;

  // window
  window_days: number; // always 90 for v1

  // PR counts
  total_prs: number;
  merged_prs: number;
  closed_without_merge: number;

  // review participation
  prs_with_review_requested: number;
  prs_with_review_received: number;

  // code hygiene
  total_rule_violations: number;
  risky_paths_prs: number;
  prs_with_tests_touched: number;
  prs_with_docs_touched: number;

  // churn metrics
  avg_additions: number;
  avg_deletions: number;
  avg_changed_files: number;

  // recency
  days_since_last_pr: number | null; // null = never contributed

  // consistency (spread of activity across weeks)
  active_weeks: number; // distinct ISO weeks with at least 1 PR
}

export interface SufficiencyResult {
  sufficient: boolean;
  checks: {
    min_prs: boolean;       // total_prs >= 3
    has_merged: boolean;    // merged_prs >= 1
    recency: boolean;       // days_since_last_pr <= 90
  };
  /** Human-readable explanation for the UI. */
  reason: string | null;  // null when sufficient
}

export interface ScoreDimension {
  raw: number;      // the intermediate value before weighting
  score: number;    // 0-100 contribution from this dimension after weighting
  weight: number;   // e.g. 0.30
}

export interface DeveloperScore {
  developer_id: string;
  score_version: number;        // increment when formula changes
  score_total: number;          // 0-100, final trust score

  // per-dimension breakdown
  merge_quality: ScoreDimension;
  review_participation: ScoreDimension;
  consistency: ScoreDimension;
  pr_hygiene: ScoreDimension;
  recent_activity: ScoreDimension;

  sufficient_data: boolean;
  explanation: string;          // short human-readable summary
  computed_at: string;          // ISO timestamp
}

/** Current formula version — bump when weights or thresholds change. */
export const SCORE_VERSION = 1;

/** Scoring weights — must sum to 1.0 */
export const SCORE_WEIGHTS = {
  merge_quality: 0.30,
  review_participation: 0.20,
  consistency: 0.20,
  pr_hygiene: 0.15,
  recent_activity: 0.15,
} as const;

/** Sufficiency thresholds */
export const SUFFICIENCY_THRESHOLDS = {
  min_total_prs: 3,
  min_merged_prs: 1,
  max_days_since_last_pr: 90,
} as const;
