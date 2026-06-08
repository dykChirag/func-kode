import posthog from "posthog-js";
import type { AnalyticsEvent } from "./events";

export { ANALYTICS_EVENTS } from "./events";
export type { AnalyticsEvent } from "./events";

export function track(event: AnalyticsEvent, properties?: Record<string, unknown>): void {
  if (typeof window === "undefined" || !posthog.__loaded) {
    return;
  }

  posthog.capture(event, properties);
}
