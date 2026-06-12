import { PostHog } from "posthog-node";
import type { AnalyticsEvent } from "./events";

const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com";

const analyticsEnabled =
  Boolean(posthogKey) &&
  (process.env.NODE_ENV !== "development" ||
    process.env.NEXT_PUBLIC_POSTHOG_ENABLED === "true");

export async function captureServerEvent(
  distinctId: string,
  event: AnalyticsEvent,
  properties?: Record<string, unknown>,
): Promise<void> {
  if (!analyticsEnabled || !posthogKey) {
    return;
  }

  const client = new PostHog(posthogKey, { host: posthogHost });

  client.capture({
    distinctId,
    event,
    properties,
  });

  await client.shutdown();
}
