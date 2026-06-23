/**
 * PR event job payload — shape stored in BullMQ (matches pr_events schema).
 */
export type PrEventType =
  | "opened"
  | "synchronized"
  | "reviewed"
  | "merged"
  | "closed"
  | "edited";

export type PrEventJob = {
  id: string;
  developer_id: string | null;
  repo_name: string;
  pr_number: number;
  github_pt_id: number;
  event_type: PrEventType;
  title: string;
  body: string | null;
  author_username: string;
  base_branch: string;
  head_branch: string;
  head_sha: string;
  additions: number | null;
  deletions: number | null;
  changed_files: number | null;
  commits_count: number | null;
  review_count: number | null;
  requested_reviewers_count: number | null;
  labels_json: string | null;
  tests_touched: boolean;
  docs_touched: boolean;
  risky_paths_hit: boolean;
  state: string;
  merged_at: string | null;
  created_at: string | null;
  updated_at: string | null;
  ingested_at: string;
  /** X-GitHub-Delivery — used for idempotency */
  delivery_id: string;
  /** Semantic idempotency key — see lib/github/idempotency-key.ts */
  idempotency_key: string;
  github_event: string;
  github_action: string;
};

export const PR_EVENTS_QUEUE_NAME = "pr-events";

/** TTL for idempotency keys in Redis (7 days). */
export const IDEMPOTENCY_TTL_SECONDS = 7 * 24 * 60 * 60;
