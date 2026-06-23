import { Queue } from "bullmq";
import { getRedisConnectionOptions } from "@/lib/redis/client";
import {
  PR_EVENTS_DLQ_NAME,
  type PrEventDlqJob,
} from "@/lib/queue/pr-events-dlq-types";

let dlq: Queue<PrEventDlqJob> | null = null;

export function getPrEventsDlq(): Queue<PrEventDlqJob> {
  if (!dlq) {
    dlq = new Queue<PrEventDlqJob>(PR_EVENTS_DLQ_NAME, {
      connection: getRedisConnectionOptions(),
      defaultJobOptions: {
        removeOnComplete: { count: 5000 },
        removeOnFail: { count: 10000 },
      },
    });
  }
  return dlq;
}

export async function enqueueDeadLetterJob(
  dlqJob: PrEventDlqJob,
): Promise<string> {
  const queue = getPrEventsDlq();
  const job = await queue.add("dead-letter", dlqJob, {
    jobId: `dlq:${dlqJob.original_job.delivery_id}`,
  });
  return job.id ?? dlqJob.original_job.delivery_id;
}

export async function closePrEventsDlq(): Promise<void> {
  if (dlq) {
    await dlq.close();
    dlq = null;
  }
}
