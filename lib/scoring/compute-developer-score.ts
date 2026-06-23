import type { DeveloperMetrics, DeveloperScore, ScoreDimension } from "./scoring-types";
import { SCORE_VERSION, SCORE_WEIGHTS } from "./scoring-types";
import { checkSufficiency } from "./sufficiency-engine";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Clamp a value to [0, 1]. */
function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

/** Build a ScoreDimension given a 0-1 raw ratio and its weight. */
function dimension(raw: number, weight: number): ScoreDimension {
  const clamped = clamp01(raw);
  return {
    raw: clamped,
    score: Math.round(clamped * weight * 100),
    weight,
  };
}

// ---------------------------------------------------------------------------
// Per-dimension scorers (each returns a 0-1 ratio)
// ---------------------------------------------------------------------------

/**
 * Merge Quality (30%)
 * Rewards a high merge rate. Penalises prolific but rarely-merged contributors.
 * Formula: merged_prs / total_prs
 */
function mergeQualityRatio(m: DeveloperMetrics): number {
  if (m.total_prs === 0) return 0;
  return m.merged_prs / m.total_prs;
}

/**
 * Review Participation (20%)
 * Rewards PRs that received a review — signals collaboration and visibility.
 * Formula: prs_with_review_received / total_prs
 */
function reviewParticipationRatio(m: DeveloperMetrics): number {
  if (m.total_prs === 0) return 0;
  return m.prs_with_review_received / m.total_prs;
}

/**
 * Consistency (20%)
 * Rewards steady, spread-out contributions over the 90-day window.
 * Max possible active_weeks in 90 days ≈ 13.
 * Formula: active_weeks / 13
 */
function consistencyRatio(m: DeveloperMetrics): number {
  const MAX_WEEKS = 13;
  return m.active_weeks / MAX_WEEKS;
}

/**
 * PR Hygiene (15%)
 * Rewards clean PRs — tests touched, docs touched, no risky paths.
 * Penalises rule violations (capped so it can't go below 0).
 *
 * Base score: 1.0
 * +0.1 if tests_touched_rate >= 0.5
 * +0.1 if docs_touched_rate >= 0.3
 * -0.15 per rule violation per PR (capped at -1.0 total)
 */
function prHygieneRatio(m: DeveloperMetrics): number {
  if (m.total_prs === 0) return 0;

  let score = 0.8; // base

  const tests_rate = m.prs_with_tests_touched / m.total_prs;
  const docs_rate = m.prs_with_docs_touched / m.total_prs;
  const violations_per_pr = m.total_rule_violations / m.total_prs;

  if (tests_rate >= 0.5) score += 0.1;
  if (docs_rate >= 0.3) score += 0.1;

  // Each violation per PR deducts 0.15, capped so score floor is 0
  const penalty = Math.min(violations_per_pr * 0.15, score);
  score -= penalty;

  return clamp01(score);
}

/**
 * Recent Activity (15%)
 * Rewards developers who contributed very recently.
 * Decay curve: full score at 0 days, zero at 90 days.
 * Formula: 1 - (days_since_last_pr / 90)
 */
function recentActivityRatio(m: DeveloperMetrics): number {
  if (m.days_since_last_pr === null) return 0;
  const MAX_DAYS = 90;
  return 1 - Math.min(m.days_since_last_pr / MAX_DAYS, 1);
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

/**
 * Computes the Patch ID developer trust score (0-100) from aggregated metrics.
 *
 * Always returns a DeveloperScore — callers should check `sufficient_data`
 * before displaying the score in the UI.
 */
export function computeDeveloperScore(metrics: DeveloperMetrics): DeveloperScore {
  const { sufficient } = checkSufficiency(metrics);

  const merge_quality = dimension(
    mergeQualityRatio(metrics),
    SCORE_WEIGHTS.merge_quality
  );
  const review_participation = dimension(
    reviewParticipationRatio(metrics),
    SCORE_WEIGHTS.review_participation
  );
  const consistency = dimension(
    consistencyRatio(metrics),
    SCORE_WEIGHTS.consistency
  );
  const pr_hygiene = dimension(
    prHygieneRatio(metrics),
    SCORE_WEIGHTS.pr_hygiene
  );
  const recent_activity = dimension(
    recentActivityRatio(metrics),
    SCORE_WEIGHTS.recent_activity
  );

  const score_total =
    merge_quality.score +
    review_participation.score +
    consistency.score +
    pr_hygiene.score +
    recent_activity.score;

  const explanation = sufficient
    ? `Score ${score_total}/100 based on ${metrics.total_prs} PRs over the last ${metrics.window_days} days.`
    : `Not enough data yet. Keep contributing to func(kode) to unlock your score.`;

  return {
    developer_id: metrics.developer_id,
    score_version: SCORE_VERSION,
    score_total: Math.min(100, score_total),
    merge_quality,
    review_participation,
    consistency,
    pr_hygiene,
    recent_activity,
    sufficient_data: sufficient,
    explanation,
    computed_at: new Date().toISOString(),
  };
}
