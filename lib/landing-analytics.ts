"use client";

import posthog from "posthog-js";

/** PostHog event names for landing page instrumentation (issue #111). */
export const ANALYTICS_EVENTS = {
  GITHUB_FORK_CLICKED: "github_fork_clicked",
} as const;

export type AnalyticsEvent = (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];

/** Fire a PostHog capture when analytics is loaded (no-op in dev / SSR). */
export function track(event: AnalyticsEvent, properties?: Record<string, unknown>) {
  if (typeof window === "undefined" || !posthog.__loaded) {
    return;
  }

  posthog.capture(event, properties);
}
