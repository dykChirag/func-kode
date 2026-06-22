/**
 * Optional standalone worker — only needed if Next.js is not running (e.g. dedicated worker dyno).
 * By default the embedded worker starts via instrumentation.ts (dev) or `after()` handles serverless.
 *
 * Run: npm run worker:pr-events
 */
import { startEmbeddedPrEventsWorker } from "@/lib/queue/pr-events-worker-runtime";
import { closePrEventsDlq } from "@/lib/queue/pr-events-dlq";
import { closePrEventsQueue } from "@/lib/queue/pr-events-queue";
import { closeRedisConnection } from "@/lib/redis/client";

async function main() {
  process.env.ENABLE_PR_EVENTS_WORKER = "true";
  const worker = await startEmbeddedPrEventsWorker();

  if (!worker) {
    console.error(
      "[pr-events-worker] cannot start — set REDIS_URL and ENABLE_PR_EVENTS_WORKER=true",
    );
    process.exit(1);
  }

  console.log("[pr-events-worker] standalone mode (embedded worker)");

  const shutdown = async () => {
    console.log("[pr-events-worker] shutting down...");
    await worker.close();
    await closePrEventsQueue();
    await closePrEventsDlq();
    await closeRedisConnection();
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

main().catch((error) => {
  console.error("[pr-events-worker] fatal:", error);
  process.exit(1);
});
