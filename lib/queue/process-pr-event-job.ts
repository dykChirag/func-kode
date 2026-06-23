import { getAdminClient } from "@/lib/supabase/admin";
import type { PrEventJob } from "@/lib/github/pr-event-types";
import { saveDeveloperScore } from "@/lib/scoring/save-developer-score";

export class PrEventProcessingError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "PrEventProcessingError";
  }
}

/**
 * Core job processor — called by both the embedded BullMQ worker and the
 * serverless `after()` fulfillment path.
 *
 * Pipeline:
 *   1. Persist the PR event to `pr_events` (idempotent on delivery_id)
 *   2. If a developer_id is present, recompute + persist their score
 *
 * Throws PrEventProcessingError on hard failure so BullMQ can retry / DLQ.
 */
export async function processPrEventJob(job: PrEventJob): Promise<void> {
  const supabase = getAdminClient();

  const { error } = await supabase.from("pr_events").upsert(
    {
      id: job.id,
      developer_id: job.developer_id,
      repo_name: job.repo_name,
      pr_number: job.pr_number,
      github_pt_id: job.github_pt_id,
      event_type: job.event_type,
      title: job.title,
      body: job.body,
      author_username: job.author_username,
      base_branch: job.base_branch,
      head_branch: job.head_branch,
      head_sha: job.head_sha,
      additions: job.additions,
      deletions: job.deletions,
      changed_files: job.changed_files,
      commits_count: job.commits_count,
      review_count: job.review_count,
      requested_reviewers_count: job.requested_reviewers_count,
      labels_json: job.labels_json ? JSON.parse(job.labels_json) : null,
      tests_touched: job.tests_touched,
      docs_touched: job.docs_touched,
      risky_paths_hit: job.risky_paths_hit,
      state: job.state,
      merged_at: job.merged_at,
      created_at: job.created_at,
      updated_at: job.updated_at,
      ingested_at: job.ingested_at,
      delivery_id: job.delivery_id,
      idempotency_key: job.idempotency_key,
      github_event: job.github_event,
      github_action: job.github_action,
    },
    {
      onConflict: "delivery_id",
      ignoreDuplicates: true, // idempotent — already-processed events are silently skipped
    },
  );

  if (error) {
    throw new PrEventProcessingError(
      `Failed to persist pr_event (delivery_id=${job.delivery_id}): ${error.message}`,
      { cause: error },
    );
  }

  // Score recomputation is best-effort — never block or throw on scoring failure.
  if (job.developer_id) {
    const result = await saveDeveloperScore(job.developer_id);
    if (result.success) {
      console.log(
        `[process-pr-event] score updated — developer=${job.developer_id} ` +
          `total=${result.score.score_total}/100 sufficient=${result.score.sufficient_data}`,
      );
    } else {
      console.error(
        `[process-pr-event] score update failed — developer=${job.developer_id} error=${result.error}`,
      );
    }
  }
}
