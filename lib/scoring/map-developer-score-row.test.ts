import { describe, expect, it } from "vitest";
import {
  buildEmptyDeveloperScore,
  mapDeveloperScoreRow,
  type DeveloperLatestScoreRow,
} from "./map-developer-score-row";
import type { DeveloperMetrics } from "./scoring-types";

const sampleMetrics: DeveloperMetrics = {
  developer_id: "dev-1",
  window_days: 90,
  total_prs: 5,
  merged_prs: 4,
  closed_without_merge: 1,
  prs_with_review_requested: 3,
  prs_with_review_received: 4,
  total_rule_violations: 0,
  risky_paths_prs: 0,
  prs_with_tests_touched: 3,
  prs_with_docs_touched: 2,
  avg_additions: 120,
  avg_deletions: 40,
  avg_changed_files: 6,
  days_since_last_pr: 7,
  active_weeks: 8,
};

const sampleRow: DeveloperLatestScoreRow = {
  id: "score-1",
  developer_id: "dev-1",
  score_version: 1,
  score_total: 73,
  merge_quality_score: 24,
  review_participation_score: 16,
  consistency_score: 12,
  pr_hygiene_score: 12,
  recent_activity_score: 9,
  metrics_json: sampleMetrics,
  sufficient_data: true,
  explanation: "Score 73/100 based on 5 PRs over the last 90 days.",
  computed_at: "2026-06-22T12:00:00.000Z",
};

describe("mapDeveloperScoreRow", () => {
  it("maps flat DB columns to nested DeveloperScore dimensions", () => {
    const result = mapDeveloperScoreRow(sampleRow);

    expect(result.developer_id).toBe("dev-1");
    expect(result.score_total).toBe(73);
    expect(result.merge_quality).toEqual({
      raw: 0.8,
      score: 24,
      weight: 0.3,
    });
    expect(result.sufficient_data).toBe(true);
    expect(result.checks).toEqual({
      min_prs: true,
      has_merged: true,
      recency: true,
    });
    expect(result.reason).toBeNull();
  });

  it("coerces numeric strings from Supabase", () => {
    const result = mapDeveloperScoreRow({
      ...sampleRow,
      score_total: "73.00",
      merge_quality_score: "24.00",
    });

    expect(result.score_total).toBe(73);
    expect(result.merge_quality.score).toBe(24);
  });
});

describe("buildEmptyDeveloperScore", () => {
  it("returns an insufficient placeholder score", () => {
    const result = buildEmptyDeveloperScore("dev-2");

    expect(result.developer_id).toBe("dev-2");
    expect(result.score_total).toBe(0);
    expect(result.sufficient_data).toBe(false);
    expect(result.checks).toEqual({
      min_prs: false,
      has_merged: false,
      recency: false,
    });
  });
});
