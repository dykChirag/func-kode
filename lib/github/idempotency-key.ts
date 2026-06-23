import type { PrEventType } from "@/lib/github/pr-event-types";

/**
 * Idempotency strategy (two layers, both stored in Redis for 7 days):
 *
 * 1. **delivery:{X-GitHub-Delivery}**
 *    Deduplicates exact GitHub webhook redeliveries of the same HTTP request.
 *
 * 2. **semantic:{semantic_key}**
 *    Deduplicates logically identical PR events within the TTL window.
 *
 * Semantic key rules:
 * | event_type   | semantic key |
 * |--------------|--------------|
 * | opened       | pr:{pt_id}:sha:{head_sha}:opened |
 * | synchronized | pr:{pt_id}:sha:{head_sha}:synchronized |
 * | merged       | pr:{pt_id}:sha:{head_sha}:merged |
 * | closed       | pr:{pt_id}:sha:{head_sha}:closed |
 * | reviewed     | pr:{pt_id}:review:{review_id} |
 * | edited       | pr:{pt_id}:delivery:{delivery_id} |
 *
 * `edited` uses delivery_id because multiple label/edit events can share the same
 * head SHA. `reviewed` uses review_id because one SHA can receive many reviews.
 */
export function buildSemanticIdempotencyKey(params: {
  githubPtId: number;
  headSha: string;
  eventType: PrEventType;
  deliveryId: string;
  reviewId?: number;
}): string {
  const { githubPtId, headSha, eventType, deliveryId, reviewId } = params;

  switch (eventType) {
    case "reviewed":
      return `pr:${githubPtId}:review:${reviewId ?? deliveryId}`;
    case "edited":
      return `pr:${githubPtId}:delivery:${deliveryId}`;
    case "opened":
    case "synchronized":
    case "merged":
    case "closed":
      return `pr:${githubPtId}:sha:${headSha}:${eventType}`;
    default:
      return `pr:${githubPtId}:sha:${headSha}:${eventType}`;
  }
}

export function deliveryIdempotencyKey(deliveryId: string): string {
  return `delivery:${deliveryId}`;
}

export function semanticIdempotencyRedisKey(semanticKey: string): string {
  return `semantic:${semanticKey}`;
}
