import { Queue } from "bullmq";
import { getRedisConnectionOptions } from "@/lib/redis/client";
import {
  PR_EVENTS_QUEUE_NAME,
  type PrEventJob,
} from "@/lib/github/pr-event-types";

let prEventsQueue: Queue<PrEventJob> | null = null;

export function getPrEventsQueue(): Queue<PrEventJob> {
  if (!prEventsQueue) {
    prEventsQueue = new Queue<PrEventJob>(PR_EVENTS_QUEUE_NAME, {
      connection: getRedisConnectionOptions(),
      defaultJobOptions: {
        attempts: 5,
        backoff: { type: "exponential", delay: 2000 },
        removeOnComplete: { count: 1000 },
        removeOnFail: { count: 5000 },
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
