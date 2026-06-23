import type { Worker } from "bullmq";
import { createPrEventsWorker } from "@/lib/queue/create-pr-events-worker";
import { isRedisConfigured } from "@/lib/redis/client";

type WorkerGlobal = typeof globalThis & {
  __prEventsWorker?: Worker;
  __prEventsWorkerStarting?: Promise<Worker>;
};

const workerGlobal = globalThis as WorkerGlobal;

/**
 * Embedded BullMQ worker can only run on long-lived Node processes (next dev, next start, Docker).
 * Serverless (Cloudflare/Vercel) uses post-response processing via `after()` instead.
 */
export function canRunEmbeddedPrEventsWorker(): boolean {
  if (process.env.ENABLE_PR_EVENTS_WORKER === "false") {
    return false;
  }
  if (!isRedisConfigured()) {
    return false;
  }
  if (process.env.NEXT_RUNTIME !== "nodejs") {
    return false;
  }
  if (process.env.ENABLE_PR_EVENTS_WORKER === "true") {
    return true;
  }
  if (process.env.NODE_ENV === "development") {
    return true;
  }
  if (process.env.VERCEL === "1" || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    return false;
  }
  return false;
}

/** Start the embedded worker once per Node process (survives Next.js hot reload). */
export async function startEmbeddedPrEventsWorker(): Promise<Worker | null> {
  if (!canRunEmbeddedPrEventsWorker()) {
    return null;
  }

  if (workerGlobal.__prEventsWorker) {
    return workerGlobal.__prEventsWorker;
  }

  if (!workerGlobal.__prEventsWorkerStarting) {
    workerGlobal.__prEventsWorkerStarting = (async () => {
      const worker = createPrEventsWorker();
      workerGlobal.__prEventsWorker = worker;
      console.log("[pr-events] embedded worker started");
      return worker;
    })();
  }

  return workerGlobal.__prEventsWorkerStarting;
}

export async function stopEmbeddedPrEventsWorker(): Promise<void> {
  const worker = workerGlobal.__prEventsWorker;
  if (!worker) {
    return;
  }
  await worker.close();
  workerGlobal.__prEventsWorker = undefined;
  workerGlobal.__prEventsWorkerStarting = undefined;
  console.log("[pr-events] embedded worker stopped");
}
