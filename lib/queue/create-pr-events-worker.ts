import { Worker, type Job } from "bullmq";
import { getRedisConnectionOptions } from "@/lib/redis/client";
import {
  PR_EVENTS_QUEUE_NAME,
  type PrEventJob,
} from "@/lib/github/pr-event-types";
import {
  moveToDeadLetterQueue,
  shouldMoveToDeadLetterQueue,
} from "@/lib/queue/move-to-dlq";
import { processPrEventJob } from "@/lib/queue/process-pr-event-job";
import {
  DEFAULT_JOB_ATTEMPTS,
  DEFAULT_JOB_BACKOFF_MS,
} from "@/lib/queue/pr-events-dlq-types";

export type PrEventsWorkerOptions = {
  concurrency?: number;
};

/**
 * BullMQ worker for the PR events queue.
 * On exhausted retries, jobs are moved to the `pr-events-dlq` dead-letter queue.
 */
export function createPrEventsWorker(
  options: PrEventsWorkerOptions = {},
): Worker<PrEventJob> {
  const worker = new Worker<PrEventJob>(
    PR_EVENTS_QUEUE_NAME,
    async (job) => {
      await processPrEventJob(job.data);
    },
    {
      connection: getRedisConnectionOptions(),
      concurrency: options.concurrency ?? 5,
    },
  );

  worker.on("failed", async (job: Job<PrEventJob> | undefined, error: Error) => {
    if (!job || !shouldMoveToDeadLetterQueue(job)) {
      return;
    }

    try {
      const dlqJobId = await moveToDeadLetterQueue(job, error);
      console.error(
        `[pr-events] moved to DLQ after ${job.attemptsMade} attempts`,
        { dlq_job_id: dlqJobId, delivery_id: job.data.delivery_id, error: error.message },
      );
    } catch (dlqError) {
      console.error("[pr-events] failed to move job to DLQ:", dlqError);
    }
  });

  worker.on("completed", (job) => {
    console.log(
      `[pr-events] processed ${job.data.event_type} PR #${job.data.pr_number} (${job.data.delivery_id})`,
    );
  });

  return worker;
}

export { DEFAULT_JOB_ATTEMPTS, DEFAULT_JOB_BACKOFF_MS };
