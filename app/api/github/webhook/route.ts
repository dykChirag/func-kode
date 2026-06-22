import { NextRequest, NextResponse } from "next/server";
import { buildPrEventJob, isSupportedWebhook } from "@/lib/github/build-pr-event-job";
import { parseGitHubWebhookBody } from "@/lib/github/parse-webhook-body";
import {
  claimIdempotencyKeys,
  releaseIdempotencyKeys,
} from "@/lib/github/idempotency-store";
import { enqueuePrEventJob } from "@/lib/queue/pr-events-queue";
import { schedulePrEventProcessing } from "@/lib/queue/schedule-pr-event-processing";
import { verifyGitHubWebhookSignature } from "@/lib/github/webhook-signature";
import { isRedisConfigured } from "@/lib/redis/client";

export const runtime = "nodejs";

/**
 * GitHub webhook — PR lifecycle events (open, sync, review, merge, close, edit).
 *
 * - HMAC validation via GITHUB_WEBHOOK_SECRET
 * - Idempotency: delivery_id + semantic key (see lib/github/idempotency-key.ts)
 * - Jobs enqueued to BullMQ; processing runs via embedded worker (dev/Docker) or `after()` (serverless)
 *
 * Subscribe to: pull_request, pull_request_review
 * @see https://docs.github.com/en/webhooks/webhook-events-and-payloads
 */
export async function POST(req: NextRequest) {
  if (!isRedisConfigured()) {
    return NextResponse.json(
      { error: "Redis is not configured (REDIS_URL)" },
      { status: 503 },
    );
  }

  const rawBody = await req.text();
  const verification = verifyGitHubWebhookSignature(rawBody, req.headers);

  if (!verification.valid) {
    console.warn("[github/webhook] signature rejected:", verification.reason);
    return NextResponse.json({ error: verification.reason }, { status: 401 });
  }

  const githubEvent = req.headers.get("x-github-event");
  const deliveryId = req.headers.get("x-github-delivery");

  if (!githubEvent || !deliveryId) {
    return NextResponse.json(
      { error: "Missing X-GitHub-Event or X-GitHub-Delivery header" },
      { status: 400 },
    );
  }

  if (githubEvent === "ping") {
    return NextResponse.json({ ok: true, ping: true });
  }

  let payload: Record<string, unknown>;
  try {
    payload = parseGitHubWebhookBody(
      rawBody,
      req.headers.get("content-type"),
    );
  } catch {
    return NextResponse.json({ error: "Invalid webhook payload" }, { status: 400 });
  }

  const action = payload.action as string | undefined;
  const merged = (payload.pull_request as { merged?: boolean } | undefined)?.merged;

  if (!isSupportedWebhook(githubEvent, action, merged)) {
    return NextResponse.json({ ok: true, skipped: true, reason: "unsupported_event" });
  }

  const job = await buildPrEventJob({
    githubEvent,
    payload: payload as Parameters<typeof buildPrEventJob>[0]["payload"],
    deliveryId,
  });

  if (!job) {
    return NextResponse.json({ ok: true, skipped: true, reason: "unparseable_payload" });
  }

  const idempotency = await claimIdempotencyKeys(
    deliveryId,
    job.idempotency_key,
  );

  if (idempotency.status === "duplicate") {
    return NextResponse.json({
      ok: true,
      duplicate: true,
      layer: idempotency.layer,
      idempotency_key: idempotency.key,
    });
  }

  try {
    const queueJobId = await enqueuePrEventJob(job);
    schedulePrEventProcessing(job);
    return NextResponse.json({
      ok: true,
      queued: true,
      job_id: queueJobId,
      event_type: job.event_type,
      pr_number: job.pr_number,
    });
  } catch (error) {
    await releaseIdempotencyKeys(deliveryId, job.idempotency_key);
    console.error("[github/webhook] enqueue failed:", error);
    return NextResponse.json({ error: "Failed to enqueue job" }, { status: 500 });
  }
}
