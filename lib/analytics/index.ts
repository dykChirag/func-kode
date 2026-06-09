import posthog from "posthog-js";
import type { AnalyticsEvent } from "./events";

export { ANALYTICS_EVENTS } from "./events";
export type { AnalyticsEvent } from "./events";

let posthogInitialized = false;

export function markPostHogInitialized(): void {
  posthogInitialized = true;
}

export function track(event: AnalyticsEvent, properties?: Record<string, unknown>): void {
  if (typeof window === "undefined" || !posthogInitialized) {
    return;
  }

  posthog.capture(event, properties);
}
