
/**
 * save-developer-score.ts
 *
 * Orchestrates the full compute + persist cycle for a single developer:
 *
 *   1. aggregateDeveloperMetrics(developerId)  → DeveloperMetrics
 *   2. computeDeveloperScore(metrics)          → DeveloperScore
 *   3. INSERT into developer_scores (service-role admin client)
 *
 * The `developer_scores` table is append-only by design — each call creates
 * a new versioned snapshot row so score history is preserved.
 *
 * RLS note: the table has no INSERT policy for `authenticated` — only the
 * `service_role` can write.  This module uses the admin client (service
 * role key), so writes succeed regardless of the caller's auth context.
 */
 
import { getAdminClient } from "@/lib/supabase/admin";
import { aggregateDeveloperMetrics } from "@/lib/scoring/aggregate-developer-metrics";
import { computeDeveloperScore } from "@/lib/scoring/compute-developer-score";
import type { DeveloperScore } from "@/lib/scoring/scoring-types";
 
/** Row shape inserted into `developer_scores`. */
interface DeveloperScoreRow {
  developer_id: string;
  score_version: number;
  score_total: number;
  merge_quality_score: number;
  review_participation_score: number;
  consistency_score: number;
  pr_hygiene_score: number;
  recent_activity_score: number;
  metrics_json: Record<string, unknown>;
  sufficient_data: boolean;
  explanation: string;
  computed_at: string;
}
 
export interface SaveDeveloperScoreResult {
  success: true;
  score: DeveloperScore;
  rowId: string;
}
 
export interface SaveDeveloperScoreFailure {
  success: false;
  error: string;
  developerId: string;
}
 
/**
 * Aggregate metrics, compute the score, and persist it to `developer_scores`.
 *
 * @returns A discriminated union — check `success` before using `score`.
 *
 * @example
 * ```ts
 * const result = await saveDeveloperScore(userId);
 * if (result.success) {
 *   console.log(`Score: ${result.score.score_total}/100`);
 * } else {
 *   console.error(result.error);
 * }
 * ```
 */
export async function saveDeveloperScore(
  developerId: string,
): Promise<SaveDeveloperScoreResult | SaveDeveloperScoreFailure> {
  try {
    // 1. Aggregate
    const metrics = await aggregateDeveloperMetrics(developerId);
 
    // 2. Compute
    const score = computeDeveloperScore(metrics);
 
    // 3. Persist
    const row: DeveloperScoreRow = {
      developer_id: score.developer_id,
      score_version: score.score_version,
      score_total: score.score_total,
      merge_quality_score: score.merge_quality.score,
      review_participation_score: score.review_participation.score,
      consistency_score: score.consistency.score,
      pr_hygiene_score: score.pr_hygiene.score,
      recent_activity_score: score.recent_activity.score,
      metrics_json: metrics as unknown as Record<string, unknown>,
      sufficient_data: score.sufficient_data,
      explanation: score.explanation,
      computed_at: score.computed_at,
    };
 
    const supabase = getAdminClient();
    const { data, error } = await supabase
      .from("developer_scores")
      .insert(row)
      .select("id")
      .single();
 
    if (error) {
      return {
        success: false,
        error: `Failed to persist developer_scores — ${error.message}`,
        developerId,
      };
    }
 
    return {
      success: true,
      score,
      rowId: data.id,
    };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unknown error in saveDeveloperScore";
    return { success: false, error: message, developerId };
  }
}
