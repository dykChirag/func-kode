/**
 * pr-events-worker.ts
 *
 * Re-exports the canonical worker factory and runtime helpers so that:
 *  - Standalone CLI scripts (`npx tsx lib/queue/pr-events-worker.ts`) still work
 *  - Any existing import of startPrEventsWorker / stopPrEventsWorker keeps compiling
 *
 * The actual Worker logic lives in:
 *   - lib/queue/create-pr-events-worker.ts  (BullMQ Worker factory)
 *   - lib/queue/process-pr-event-job.ts     (persist + score)
 *   - lib/queue/pr-events-worker-runtime.ts (embedded lifecycle / globalThis guard)
 */

export {
  createPrEventsWorker,
  type PrEventsWorkerOptions,
} from "@/lib/queue/create-pr-events-worker";

export {
  canRunEmbeddedPrEventsWorker,
  startEmbeddedPrEventsWorker as startPrEventsWorker,
  stopEmbeddedPrEventsWorker as stopPrEventsWorker,
} from "@/lib/queue/pr-events-worker-runtime";

export { runtime } from "@/lib/queue/worker-runtime-tag";
