import { startEmbeddedPrEventsWorker } from "@/lib/queue/pr-events-worker-runtime";

export async function registerPrEventsWorker(): Promise<void> {
  try {
    await startEmbeddedPrEventsWorker();
  } catch (error) {
    console.error("[pr-events] failed to start embedded worker:", error);
  }
}
