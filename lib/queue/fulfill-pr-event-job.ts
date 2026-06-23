import type { PrEventJob } from "@/lib/github/pr-event-types";
import { PR_EVENTS_QUEUE_NAME } from "@/lib/github/pr-event-types";
import { enqueueDeadLetterJob } from "@/lib/queue/pr-events-dlq";
import {
  DEFAULT_JOB_ATTEMPTS,
  DEFAULT_JOB_BACKOFF_MS,
} from "@/lib/queue/pr-events-dlq-types";
import { processPrEventJob } from "@/lib/queue/process-pr-event-job";
import { getPrEventsQueue } from "@/lib/queue/pr-events-queue";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function removeQueueJob(deliveryId: string): Promise<void> {
  const queue = getPrEventsQueue();
  const bullJob = await queue.getJob(deliveryId);
  if (bullJob) {
    await bullJob.remove();
  }
}

/**
 * Process a PR event job with retries, then remove from the main queue or move to DLQ.
 * Used by post-response `after()` processing on serverless and as a fast path when embedded worker is off.
 */
export async function fulfillPrEventJob(job: PrEventJob): Promise<void> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= DEFAULT_JOB_ATTEMPTS; attempt++) {
    try {
      await processPrEventJob(job);
      await removeQueueJob(job.delivery_id);
      console.log(
        `[pr-events] fulfilled ${job.event_type} PR #${job.pr_number} (${job.delivery_id})`,
      );
      return;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.warn(
        `[pr-events] fulfill attempt ${attempt}/${DEFAULT_JOB_ATTEMPTS} failed:`,
        lastError.message,
      );

      if (attempt < DEFAULT_JOB_ATTEMPTS) {
        await sleep(DEFAULT_JOB_BACKOFF_MS * 2 ** (attempt - 1));
      }
    }
  }

  const error = lastError ?? new Error("Unknown processing error");

  await enqueueDeadLetterJob({
    original_job: job,
    failed_at: new Date().toISOString(),
    error_message: error.message,
    error_stack: error.stack ?? null,
    attempts_made: DEFAULT_JOB_ATTEMPTS,
    bull_job_id: job.delivery_id,
    source_queue: PR_EVENTS_QUEUE_NAME,
  });

  await removeQueueJob(job.delivery_id);

  console.error(
    `[pr-events] moved to DLQ after inline retries (${job.delivery_id}):`,
    error.message,
  );
}
