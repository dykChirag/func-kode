import {
  PR_EVENTS_QUEUE_NAME,
  type PrEventJob,
} from "@/lib/github/pr-event-types";

/** Dead-letter queue for PR event jobs that exhaust retries. */
export const PR_EVENTS_DLQ_NAME = "pr-events-dlq";

export type PrEventDlqJob = {
  original_job: PrEventJob;
  failed_at: string;
  error_message: string;
  error_stack: string | null;
  attempts_made: number;
  bull_job_id: string | null;
  source_queue: typeof PR_EVENTS_QUEUE_NAME;
};

export const DEFAULT_JOB_ATTEMPTS = 5;
export const DEFAULT_JOB_BACKOFF_MS = 2000;
