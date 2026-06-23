/**
 * aggregate-developer-metrics.ts
 *
 * Reads the last 90 days of `pr_events` rows for a given developer from
 * Supabase and reduces them into the exact `DeveloperMetrics` shape that
 * `computeDeveloperScore` expects.
 *
 * The aggregation is performed in TypeScript rather than via SQL views so
 * the logic stays co-located with the scoring engine and is testable in
 * isolation with Vitest.
 */

import { getAdminClient } from "@/lib/supabase/admin";
import type { DeveloperMetrics } from "@/lib/scoring/scoring-types";

/** Fixed evaluation window — keep in sync with sufficiency thresholds. */
const WINDOW_DAYS = 90;

/**
 * Row shape we select from `pr_events`.
 * Only the columns needed for aggregation are typed here.
 */
interface PrEventRow {
  id: string;
  github_pt_id: number;
  event_type: string;
  state: string;
  merged_at: string | null;
  created_at: string | null;
  updated_at: string | null;
  additions: number | null;
  deletions: number | null;
  changed_files: number | null;
  review_count: number | null;
  requested_reviewers_count: number | null;
  tests_touched: boolean;
  docs_touched: boolean;
  risky_paths_hit: boolean;
}

/**
 * Error thrown when the developer has no `profiles` row or Supabase returns
 * no data at all.  Callers can catch this to return a 404.
 */
export class DeveloperNotFoundError extends Error {
  constructor(developerId: string) {
    super(`Developer ${developerId} not found in profiles table`);
    this.name = "DeveloperNotFoundError";
  }
}

/**
 * Aggregate `pr_events` for a developer over the last 90 days into the
 * `DeveloperMetrics` shape.
 *
 * @throws {DeveloperNotFoundError} if no `profiles` row exists for `developerId`
 * @throws {Error} on Supabase query failures
 */
export async function aggregateDeveloperMetrics(
  developerId: string,
): Promise<DeveloperMetrics> {
  const supabase = getAdminClient();

  // -----------------------------------------------------------------------
  // 1. Verify the developer exists — avoids computing on a stale FK.
  //    .single() returns PGRST116 when zero rows match, which we map to a
  //    precise DeveloperNotFoundError.
  // -----------------------------------------------------------------------
  const { error: profileErr } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", developerId)
    .single();

  if (profileErr) {
    if (profileErr.code === "PGRST116") {
      throw new DeveloperNotFoundError(developerId);
    }
    throw new Error(
      `aggregateDeveloperMetrics: profiles lookup failed — ${profileErr.message}`,
    );
  }

  // -----------------------------------------------------------------------
  // 2. Fetch pr_events from the last WINDOW_DAYS days.
  // -----------------------------------------------------------------------
  const windowStart = new Date(Date.now() - WINDOW_DAYS * 24 * 60 * 60 * 1000);

  const { data: rows, error: queryError } = await supabase
    .from("pr_events")
    .select(
      "id, github_pt_id, event_type, state, merged_at, created_at, updated_at, " +
        "additions, deletions, changed_files, review_count, " +
        "requested_reviewers_count, tests_touched, docs_touched, risky_paths_hit",
    )
    .eq("developer_id", developerId)
    .gte("ingested_at", windowStart.toISOString())
    .returns<PrEventRow[]>();

  if (queryError) {
    throw new Error(
      `aggregateDeveloperMetrics: pr_events query failed — ${queryError.message}`,
    );
  }

  const events = rows ?? [];

  // -----------------------------------------------------------------------
  // 3. Reduce into DeveloperMetrics.
  // -----------------------------------------------------------------------
  // Each distinct PR can appear as multiple event rows (opened, edited,
  // synchronized, reviewed, merged, closed).  We deduplicate by github_pt_id
  // and pick the **latest** row per PR (by updated_at) as the source of
  // truth for that PR's metrics.
  const prsByGitHubId = new Map<number, PrEventRow>();

  for (const row of events) {
    const existing = prsByGitHubId.get(row.github_pt_id);
    if (!existing) {
      prsByGitHubId.set(row.github_pt_id, row);
      continue;
    }
    // Keep the row with the most recent updated_at (or created_at fallback).
    const existingTs = Date.parse(existing.updated_at ?? existing.created_at ?? "");
    const currentTs = Date.parse(row.updated_at ?? row.created_at ?? "");
    if (currentTs >= existingTs) {
      prsByGitHubId.set(row.github_pt_id, row);
    }
  }

  const distinctPrs = Array.from(prsByGitHubId.values());

  // --- PR counts ---
  const total_prs = distinctPrs.length;

  let merged_prs = 0;
  let closed_without_merge = 0;
  let prs_with_review_requested = 0;
  let prs_with_review_received = 0;

  // --- hygiene ---
  let total_rule_violations = 0;
  let risky_paths_prs = 0;
  let prs_with_tests_touched = 0;
  let prs_with_docs_touched = 0;

  // --- churn (averaged over PRs that have non-null additions) ---
  let additionsSum = 0;
  let deletionsSum = 0;
  let changedFilesSum = 0;
  let churnPrCount = 0;

  // --- recency ---
  let lastPrTimestamp: number | null = null;

  // --- consistency (distinct ISO weeks) ---
  const activeWeeksSet = new Set<string>();

  for (const pr of distinctPrs) {
    // Merge / close state — determined by the latest event for this PR.
    if (pr.event_type === "merged" || pr.merged_at !== null) {
      merged_prs++;
    } else if (pr.event_type === "closed" && pr.merged_at === null) {
      closed_without_merge++;
    }

    // Review participation
    if ((pr.requested_reviewers_count ?? 0) > 0) {
      prs_with_review_requested++;
    }
    if ((pr.review_count ?? 0) > 0) {
      prs_with_review_received++;
    }

    // Hygiene
    if (pr.risky_paths_hit) {
      risky_paths_prs++;
      total_rule_violations++; // 1 violation per PR that hit risky paths
    }
    if (pr.tests_touched) {
      prs_with_tests_touched++;
    }
    if (pr.docs_touched) {
      prs_with_docs_touched++;
    }

    // Churn — only count PRs that actually have diff stats
    if (
      pr.additions !== null ||
      pr.deletions !== null ||
      pr.changed_files !== null
    ) {
      additionsSum += pr.additions ?? 0;
      deletionsSum += pr.deletions ?? 0;
      changedFilesSum += pr.changed_files ?? 0;
      churnPrCount++;
    }

    // Recency — use updated_at if available, else created_at
    const ts = pr.updated_at ?? pr.created_at;
    if (ts) {
      const parsed = Date.parse(ts);
      if (!Number.isNaN(parsed)) {
        if (lastPrTimestamp === null || parsed > lastPrTimestamp) {
          lastPrTimestamp = parsed;
        }

        // ISO week key: "YYYY-W##"
        const date = new Date(parsed);
        const weekKey = getIsoWeekKey(date);
        activeWeeksSet.add(weekKey);
      }
    }
  }

  // --- days_since_last_pr ---
  let days_since_last_pr: number | null = null;
  if (lastPrTimestamp !== null) {
    days_since_last_pr = Math.floor(
      (Date.now() - lastPrTimestamp) / (24 * 60 * 60 * 1000),
    );
  }

  // --- averages ---
  const avg_additions = churnPrCount > 0 ? additionsSum / churnPrCount : 0;
  const avg_deletions = churnPrCount > 0 ? deletionsSum / churnPrCount : 0;
  const avg_changed_files = churnPrCount > 0 ? changedFilesSum / churnPrCount : 0;

  return {
    developer_id: developerId,
    window_days: WINDOW_DAYS,
    total_prs,
    merged_prs,
    closed_without_merge,
    prs_with_review_requested,
    prs_with_review_received,
    total_rule_violations,
    risky_paths_prs,
    prs_with_tests_touched,
    prs_with_docs_touched,
    avg_additions: Math.round(avg_additions * 100) / 100,
    avg_deletions: Math.round(avg_deletions * 100) / 100,
    avg_changed_files: Math.round(avg_changed_files * 100) / 100,
    days_since_last_pr,
    active_weeks: activeWeeksSet.size,
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Returns a stable ISO week key "YYYY-W##" for a given date.
 * Uses UTC to avoid timezone-dependent week boundaries.
 */
function getIsoWeekKey(date: Date): string {
  const d = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
  // Set to nearest Thursday: current date + 3 - current day as ISO day (Mon=1..Sun=7)
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNum = Math.ceil(
    ((d.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7,
  );
  return `${d.getUTCFullYear()}-W${String(weekNum).padStart(2, "0")}`;
}