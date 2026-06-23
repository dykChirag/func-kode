import type { PrEventType } from "@/lib/github/pr-event-types";

/** GitHub webhook events we subscribe to for PR lifecycle tracking. */
export const PR_WEBHOOK_EVENTS = ["pull_request", "pull_request_review"] as const;

export type PrWebhookEvent = (typeof PR_WEBHOOK_EVENTS)[number];

/**
 * pull_request actions → internal event_type.
 * @see https://docs.github.com/en/webhooks/webhook-events-and-payloads#pull_request
 */
export const PULL_REQUEST_ACTION_MAP: Record<string, PrEventType | null> = {
  opened: "opened",
  reopened: "opened",
  ready_for_review: "opened",
  synchronize: "synchronized",
  edited: "edited",
  labeled: "edited",
  unlabeled: "edited",
  review_requested: "edited",
  review_request_removed: "edited",
  closed: null, // resolved via merged flag → merged | closed
};

/** pull_request_review actions we handle. */
export const PULL_REQUEST_REVIEW_ACTIONS = ["submitted"] as const;

export function resolvePullRequestEventType(
  action: string,
  merged: boolean,
): PrEventType | null {
  if (action === "closed") {
    return merged ? "merged" : "closed";
  }
  return PULL_REQUEST_ACTION_MAP[action] ?? null;
}

export function isSupportedPrWebhook(
  githubEvent: string,
  action: string | undefined,
  merged?: boolean,
): boolean {
  if (!action) {
    return false;
  }

  if (githubEvent === "pull_request_review") {
    return (PULL_REQUEST_REVIEW_ACTIONS as readonly string[]).includes(action);
  }

  if (githubEvent === "pull_request") {
    return resolvePullRequestEventType(action, merged ?? false) !== null;
  }

  return false;
}

export function resolvePrEventType(
  githubEvent: string,
  action: string,
  merged: boolean,
): PrEventType | null {
  if (githubEvent === "pull_request_review" && action === "submitted") {
    return "reviewed";
  }
  if (githubEvent === "pull_request") {
    return resolvePullRequestEventType(action, merged);
  }
  return null;
}
