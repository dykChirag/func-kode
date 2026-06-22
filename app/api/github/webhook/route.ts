import { NextRequest, NextResponse } from "next/server";
import { buildPrEventJob, isSupportedWebhook } from "@/lib/github/build-pr-event-job";
import {
  claimIdempotencyKeys,
  releaseIdempotencyKeys,
} from "@/lib/github/idempotency-store";
import { enqueuePrEventJob } from "@/lib/queue/pr-events-queue";
import { verifyGitHubWebhookSignature } from "@/lib/github/webhook-signature";
import { isRedisConfigured } from "@/lib/redis/client";

export const runtime = "nodejs";

/**
 * GitHub webhook — PR lifecycle events (open, sync, review, merge, close, edit).
 *
 * - HMAC validation via GITHUB_WEBHOOK_SECRET
 * - Idempotency via Redis (delivery_id + pr_id:sha:event_type)
 * - Jobs enqueued to BullMQ (Redis)
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

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(rawBody) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
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
      idempotency_key: idempotency.key,
    });
  }

  try {
    const queueJobId = await enqueuePrEventJob(job);
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
