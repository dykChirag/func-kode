import { Queue } from "bullmq";
import { getRedisConnectionOptions } from "@/lib/redis/client";
import {
  PR_EVENTS_QUEUE_NAME,
  type PrEventJob,
} from "@/lib/github/pr-event-types";
import {
  DEFAULT_JOB_ATTEMPTS,
  DEFAULT_JOB_BACKOFF_MS,
} from "@/lib/queue/pr-events-dlq-types";

let prEventsQueue: Queue<PrEventJob> | null = null;

export function getPrEventsQueue(): Queue<PrEventJob> {
  if (!prEventsQueue) {
    prEventsQueue = new Queue<PrEventJob>(PR_EVENTS_QUEUE_NAME, {
      connection: getRedisConnectionOptions(),
      defaultJobOptions: {
        attempts: DEFAULT_JOB_ATTEMPTS,
        backoff: { type: "exponential", delay: DEFAULT_JOB_BACKOFF_MS },
        removeOnComplete: { count: 1000 },
        removeOnFail: false,
      },
    });
  }
  return prEventsQueue;
}

export async function enqueuePrEventJob(job: PrEventJob): Promise<string> {
  const queue = getPrEventsQueue();
  const bullJob = await queue.add(job.event_type, job, {
    jobId: job.delivery_id,
  });
  return bullJob.id ?? job.delivery_id;
}

export async function closePrEventsQueue(): Promise<void> {
  if (prEventsQueue) {
    await prEventsQueue.close();
    prEventsQueue = null;
  }
}
