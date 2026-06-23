import type { Job } from "bullmq";
import type { PrEventJob } from "@/lib/github/pr-event-types";
import { PR_EVENTS_QUEUE_NAME } from "@/lib/github/pr-event-types";
import { enqueueDeadLetterJob } from "@/lib/queue/pr-events-dlq";
import {
  DEFAULT_JOB_ATTEMPTS,
  type PrEventDlqJob,
} from "@/lib/queue/pr-events-dlq-types";

export function shouldMoveToDeadLetterQueue(
  job: Job<PrEventJob>,
): boolean {
  const maxAttempts = job.opts.attempts ?? DEFAULT_JOB_ATTEMPTS;
  return job.attemptsMade >= maxAttempts;
}

export async function moveToDeadLetterQueue(
  job: Job<PrEventJob>,
  error: Error,
): Promise<string> {
  const dlqPayload: PrEventDlqJob = {
    original_job: job.data,
    failed_at: new Date().toISOString(),
    error_message: error.message,
    error_stack: error.stack ?? null,
    attempts_made: job.attemptsMade,
    bull_job_id: job.id ?? null,
    source_queue: PR_EVENTS_QUEUE_NAME,
  };

  return enqueueDeadLetterJob(dlqPayload);
}
