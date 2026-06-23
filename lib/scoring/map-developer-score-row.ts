import { checkSufficiency } from "./sufficiency-engine";
import type {
  DeveloperMetrics,
  DeveloperScore,
  ScoreDimension,
  SufficiencyResult,
} from "./scoring-types";
import { SCORE_VERSION, SCORE_WEIGHTS } from "./scoring-types";

/** Row shape from the `developer_latest_scores` Supabase view. */
export type DeveloperLatestScoreRow = {
  id: string;
  developer_id: string;
  score_version: number;
  score_total: number | string;
  merge_quality_score: number | string;
  review_participation_score: number | string;
  consistency_score: number | string;
  pr_hygiene_score: number | string;
  recent_activity_score: number | string;
  metrics_json: DeveloperMetrics | null;
  sufficient_data: boolean;
  explanation: string | null;
  computed_at: string;
};

export type DeveloperScoreResponse = DeveloperScore & {
  checks: SufficiencyResult["checks"];
  reason: string | null;
};

function toNumber(value: number | string): number {
  return typeof value === "number" ? value : Number(value);
}

function toDimension(weightedScore: number | string, weight: number): ScoreDimension {
  const score = toNumber(weightedScore);
  const raw = weight > 0 ? score / (weight * 100) : 0;

  return {
    raw: Math.max(0, Math.min(1, raw)),
    score: Math.round(score),
    weight,
  };
}

function zeroDimension(weight: number): ScoreDimension {
  return { raw: 0, score: 0, weight };
}

export function buildEmptyDeveloperScore(developerId: string): DeveloperScoreResponse {
  return {
    developer_id: developerId,
    score_version: SCORE_VERSION,
    score_total: 0,
    merge_quality: zeroDimension(SCORE_WEIGHTS.merge_quality),
    review_participation: zeroDimension(SCORE_WEIGHTS.review_participation),
    consistency: zeroDimension(SCORE_WEIGHTS.consistency),
    pr_hygiene: zeroDimension(SCORE_WEIGHTS.pr_hygiene),
    recent_activity: zeroDimension(SCORE_WEIGHTS.recent_activity),
    sufficient_data: false,
    explanation:
      "Not enough data yet. Keep contributing to func(kode) to unlock your score.",
    computed_at: new Date().toISOString(),
    checks: { min_prs: false, has_merged: false, recency: false },
    reason: "no PR activity found",
  };
}

export function mapDeveloperScoreRow(row: DeveloperLatestScoreRow): DeveloperScoreResponse {
  const sufficiency = row.metrics_json
    ? checkSufficiency(row.metrics_json)
    : {
        sufficient: row.sufficient_data,
        checks: { min_prs: false, has_merged: false, recency: false },
        reason: row.sufficient_data ? null : "no PR activity found",
      };

  return {
    developer_id: row.developer_id,
    score_version: row.score_version,
    score_total: toNumber(row.score_total),
    merge_quality: toDimension(row.merge_quality_score, SCORE_WEIGHTS.merge_quality),
    review_participation: toDimension(
      row.review_participation_score,
      SCORE_WEIGHTS.review_participation
    ),
    consistency: toDimension(row.consistency_score, SCORE_WEIGHTS.consistency),
    pr_hygiene: toDimension(row.pr_hygiene_score, SCORE_WEIGHTS.pr_hygiene),
    recent_activity: toDimension(row.recent_activity_score, SCORE_WEIGHTS.recent_activity),
    sufficient_data: row.sufficient_data,
    explanation:
      row.explanation ??
      "Not enough data yet. Keep contributing to func(kode) to unlock your score.",
    computed_at: row.computed_at,
    checks: sufficiency.checks,
    reason: sufficiency.reason,
  };
}
