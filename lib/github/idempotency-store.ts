import { getRedisConnection } from "@/lib/redis/client";
import { IDEMPOTENCY_TTL_SECONDS } from "@/lib/github/pr-event-types";

const KEY_PREFIX = "webhook:idempotency:";

export type IdempotencyResult =
  | { status: "new" }
  | { status: "duplicate"; key: string };

/**
 * Returns "new" if this delivery has not been processed.
 * Uses delivery_id (X-GitHub-Delivery) and a composite pr_id+sha key.
 */
export async function claimIdempotencyKeys(
  deliveryId: string,
  compositeKey: string,
): Promise<IdempotencyResult> {
  const redis = getRedisConnection();
  await redis.connect().catch(() => {
    /* already connected */
  });

  const deliveryRedisKey = `${KEY_PREFIX}delivery:${deliveryId}`;
  const compositeRedisKey = `${KEY_PREFIX}composite:${compositeKey}`;

  const pipeline = redis.multi();
  pipeline.set(deliveryRedisKey, "1", "EX", IDEMPOTENCY_TTL_SECONDS, "NX");
  pipeline.set(compositeRedisKey, deliveryId, "EX", IDEMPOTENCY_TTL_SECONDS, "NX");

  const results = await pipeline.exec();
  const deliverySet = results?.[0]?.[1] === "OK";
  const compositeSet = results?.[1]?.[1] === "OK";

  if (!deliverySet) {
    return { status: "duplicate", key: deliveryId };
  }

  if (!compositeSet) {
    await redis.del(deliveryRedisKey);
    return { status: "duplicate", key: compositeKey };
  }

  return { status: "new" };
}

/** Release keys on enqueue failure so GitHub can retry. */
export async function releaseIdempotencyKeys(
  deliveryId: string,
  compositeKey: string,
): Promise<void> {
  const redis = getRedisConnection();
  await redis.del(
    `${KEY_PREFIX}delivery:${deliveryId}`,
    `${KEY_PREFIX}composite:${compositeKey}`,
  );
}
