import type { Worker } from "bullmq";
import { createPrEventsWorker } from "@/lib/queue/create-pr-events-worker";
import { isRedisConfigured } from "@/lib/redis/client";

type WorkerGlobal = typeof globalThis & {
  __prEventsWorker?: Worker;
  __prEventsWorkerStarting?: Promise<Worker>;
};

const workerGlobal = globalThis as WorkerGlobal;

/**
 * Whether the embedded BullMQ worker can start in this process.
 *
 * Rules (evaluated in order):
 *  - Explicitly disabled → false
 *  - Redis not configured → false
 *  - Not a Node.js runtime → false (Edge / WASM runtimes cannot run BullMQ)
 *  - Explicitly enabled → true
 *  - Running in development → true
 *  - Long-lived Node server (not a serverless function) → true
 *  - Serverless indicator present → false
 */
export function canRunEmbeddedPrEventsWorker(): boolean {
  if (process.env.ENABLE_PR_EVENTS_WORKER === "false") return false;
  if (!isRedisConfigured()) return false;
  if (process.env.NEXT_RUNTIME !== "nodejs") return false;
  if (process.env.ENABLE_PR_EVENTS_WORKER === "true") return true;
  if (process.env.NODE_ENV === "development") return true;

  // Serverless platforms: Vercel Lambda, AWS Lambda, Cloudflare Workers
  if (
    process.env.VERCEL === "1" ||
    process.env.AWS_LAMBDA_FUNCTION_NAME ||
    process.env.CLOUDFLARE_WORKER
  ) {
    return false;
  }

  // Any other long-lived Node server (Docker, Railway, Fly.io, Render) → run it
  return true;
}

/** Start the embedded worker exactly once per Node process (survives Next.js hot-reload). */
export async function startEmbeddedPrEventsWorker(): Promise<Worker | null> {
  if (!canRunEmbeddedPrEventsWorker()) {
    console.log(
      "[pr-events] embedded worker skipped — set ENABLE_PR_EVENTS_WORKER=true to force on this platform",
    );
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
  if (!worker) return;
  await worker.close();
  workerGlobal.__prEventsWorker = undefined;
  workerGlobal.__prEventsWorkerStarting = undefined;
  console.log("[pr-events] embedded worker stopped");
}
