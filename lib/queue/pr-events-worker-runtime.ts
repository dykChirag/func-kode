import type { Worker } from "bullmq";
import { createPrEventsWorker } from "@/lib/queue/create-pr-events-worker";
import { isRedisConfigured } from "@/lib/redis/client";

type WorkerGlobal = typeof globalThis & {
  __prEventsWorker?: Worker;
  __prEventsWorkerStarting?: Promise<Worker>;
};

const workerGlobal = globalThis as WorkerGlobal;

/**
 * Detect whether the current process is running inside a Cloudflare isolate.
 *
 * OpenNext on Cloudflare Workers sets NEXT_RUNTIME="edge" — so the
 * NEXT_RUNTIME !== "nodejs" guard in canRunEmbeddedPrEventsWorker() already
 * blocks us. This helper is an explicit belt-and-suspenders check that also
 * catches Cloudflare Pages and any future OpenNext runtime modes.
 *
 * Wrangler / Cloudflare inject these env vars at runtime:
 *  - CF_PAGES          → "1" on Cloudflare Pages
 *  - WORKERS_RS_VERSION → set in the Workers runtime
 *  - CF_WORKERS_AI_ACCOUNT_ID → set when AI binding is present
 *
 * None of these are set in a real Node.js Docker/Railway/Fly process.
 */
function isCloudflareRuntime(): boolean {
  return (
    process.env.CF_PAGES === "1" ||
    typeof process.env.WORKERS_RS_VERSION === "string" ||
    typeof process.env.CF_WORKERS_AI_ACCOUNT_ID === "string"
  );
}

/**
 * Whether the embedded BullMQ worker can and should start in this process.
 *
 * Decision tree (evaluated top-down, first match wins):
 *
 *  1. ENABLE_PR_EVENTS_WORKER=false  → never start  (operator kill-switch)
 *  2. Redis not configured           → cannot start  (no queue)
 *  3. NEXT_RUNTIME !== 'nodejs'      → cannot start  (edge / WASM / CF Workers)
 *     ↳ Cloudflare Workers via OpenNext sets NEXT_RUNTIME='edge'
 *  4. Cloudflare runtime detected    → never start  (isolate, no long-lived process)
 *  5. ENABLE_PR_EVENTS_WORKER=true   → always start  (operator force-on)
 *  6. NODE_ENV=development           → start         (local dev)
 *  7. Known serverless platform      → never start  (Vercel / AWS Lambda)
 *  8. Everything else                → start         (Docker / Railway / Fly / Render)
 */
export function canRunEmbeddedPrEventsWorker(): boolean {
  // 1. Explicit operator kill-switch
  if (process.env.ENABLE_PR_EVENTS_WORKER === "false") return false;

  // 2. No Redis → no queue to consume from
  if (!isRedisConfigured()) return false;

  // 3. Not a Node.js runtime — Cloudflare Workers / OpenNext runs as 'edge'
  if (process.env.NEXT_RUNTIME !== "nodejs") return false;

  // 4. Belt-and-suspenders: explicit Cloudflare runtime detection
  //    Catches CF Pages and any future OpenNext modes that might set NEXT_RUNTIME=nodejs
  if (isCloudflareRuntime()) return false;

  // 5. Operator explicitly enabled — trust them
  if (process.env.ENABLE_PR_EVENTS_WORKER === "true") return true;

  // 6. Local development — always run for fast feedback
  if (process.env.NODE_ENV === "development") return true;

  // 7. Serverless platforms — request lifecycle is too short for a queue worker
  if (process.env.VERCEL === "1" || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    return false;
  }

  // 8. Long-lived Node server (Docker, Railway, Fly.io, Render, bare metal)
  return true;
}

/** Start the embedded worker exactly once per Node process (survives Next.js hot-reload). */
export async function startEmbeddedPrEventsWorker(): Promise<Worker | null> {
  if (!canRunEmbeddedPrEventsWorker()) {
    console.log(
      "[pr-events] embedded worker skipped" +
        (isCloudflareRuntime()
          ? " — Cloudflare isolate detected, use after() fulfillment path instead"
          : " — set ENABLE_PR_EVENTS_WORKER=true to force-enable on this platform"),
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
