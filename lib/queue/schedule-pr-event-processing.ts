import { after } from "next/server";
import type { PrEventJob } from "@/lib/github/pr-event-types";
import { fulfillPrEventJob } from "@/lib/queue/fulfill-pr-event-job";
import { canRunEmbeddedPrEventsWorker } from "@/lib/queue/pr-events-worker-runtime";

/**
 * Schedules PR event processing after the webhook response is sent.
 *
 * - Serverless (Cloudflare/Vercel): primary processor via `fulfillPrEventJob`
 * - Long-lived Node with embedded worker: worker consumes the queue (no inline fulfill)
 */
export function schedulePrEventProcessing(job: PrEventJob): void {
  if (canRunEmbeddedPrEventsWorker()) {
    return;
  }

  after(async () => {
    try {
      await fulfillPrEventJob(job);
    } catch (error) {
      console.error("[pr-events] scheduled processing failed:", error);
    }
  });
}
