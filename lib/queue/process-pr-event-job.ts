import { createClient } from "@supabase/supabase-js";
import type { PrEventJob } from "@/lib/github/pr-event-types";

export class PrEventProcessingError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "PrEventProcessingError";
  }
}

/**
 * Persists a PR event job to Supabase `pr_events`.
 * Throws on failure so BullMQ can retry / dead-letter the job.
 */
export async function processPrEventJob(job: PrEventJob): Promise<void> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    throw new PrEventProcessingError(
      "SUPABASE_SERVICE_ROLE_KEY is required to process PR event jobs",
    );
  }

  const supabase = createClient(supabaseUrl, serviceKey);

  const row = {
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
  };

  const { error } = await supabase.from("pr_events").upsert(row, {
    onConflict: "delivery_id",
    ignoreDuplicates: false,
  });

  if (error) {
    throw new PrEventProcessingError(`Failed to persist pr_event: ${error.message}`, {
      cause: error,
    });
  }
}
