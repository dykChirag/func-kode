
/**
 * normalize-pr-event.ts
 *
 * Public entry point for normalizing a raw GitHub webhook payload into a
 * structured `NormalizedPREvent` that can be persisted to the `pr_events`
 * table and fed into the scoring pipeline.
 *
 * Delegates to the existing {@link buildPrEventJob} which already handles:
 *   - GitHub API enrichment (files, reviews, commits)
 *   - developer_id resolution from `profiles.github_username`
 *   - path analysis (tests / docs / risky-paths)
 *   - idempotency key generation
 *
 * This wrapper exists so callers (workers, tests, API routes) have a single,
 * stable import surface with a clearly named type.
 */
 
import { buildPrEventJob } from "@/lib/github/build-pr-event-job";
import type { PrEventJob } from "@/lib/github/pr-event-types";
 
/**
 * Normalized representation of a single GitHub PR webhook delivery.
 * Shape mirrors the `pr_events` table schema 1:1.
 */
export type NormalizedPREvent = PrEventJob;
 
/**
 * Input accepted by {@link normalizePREvent}.
 *
 * `githubEvent` — value of the `X-GitHub-Event` header ("pull_request" or
 *   "pull_request_review").
 * `deliveryId` — value of the `X-GitHub-Delivery` header (UUID).
 * `payload`    — the raw, already-parsed webhook JSON body.
 */
export interface NormalizePREventInput {
  githubEvent: string;
  deliveryId: string;
  payload: Record<string, unknown>;
}
 
export interface NormalizePREventResult {
  ok: true;
  event: NormalizedPREvent;
}
 
export interface NormalizePREventRejection {
  ok: false;
  reason:
    | "missing_pull_request"
    | "missing_repository"
    | "unsupported_event"
    | "unparseable_payload";
}
 
/**
 * Normalize a raw GitHub webhook payload into a {@link NormalizedPREvent}.
 *
 * Performs GitHub API enrichment and developer resolution, so it is async
 * and may take a few hundred milliseconds.  Returns a discriminated union
 * so callers can distinguish "successfully normalized" from "unsupported /
 * unparseable" without throwing.
 *
 * @example
 * ```ts
 * const result = await normalizePREvent({ githubEvent, deliveryId, payload });
 * if (!result.ok) {
 *   console.log("skipped:", result.reason);
 *   return;
 * }
 * await persistPrEvent(result.event);
 * ```
 */
export async function normalizePREvent(
  input: NormalizePREventInput,
): Promise<NormalizePREventResult | NormalizePREventRejection> {
  const { githubEvent, deliveryId, payload } = input;
 
  // Lightweight pre-checks so we can return a precise rejection reason
  // without paying for the full enrichment round-trip.
  const pr = payload.pull_request as Record<string, unknown> | undefined;
  const repo = payload.repository as { full_name?: string } | undefined;
 
  if (!pr) {
    return { ok: false, reason: "missing_pull_request" };
  }
  if (!repo?.full_name) {
    return { ok: false, reason: "missing_repository" };
  }
 
  const job = await buildPrEventJob({
    githubEvent,
    payload: payload as Parameters<typeof buildPrEventJob>[0]["payload"],
    deliveryId,
  });
 
  if (!job) {
    return { ok: false, reason: "unsupported_event" };
  }
 
  return { ok: true, event: job };
}