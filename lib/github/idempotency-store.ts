import { getRedisConnection } from "@/lib/redis/client";
import {
  deliveryIdempotencyKey,
  semanticIdempotencyRedisKey,
} from "@/lib/github/idempotency-key";
import { IDEMPOTENCY_TTL_SECONDS } from "@/lib/github/pr-event-types";

const KEY_PREFIX = "webhook:idempotency:";

export type IdempotencyResult =
  | { status: "new" }
  | { status: "duplicate"; layer: "delivery" | "semantic"; key: string };

/**
 * Atomically claims delivery + semantic idempotency keys.
 * Both must succeed; rolls back delivery key if semantic key is taken.
 */
export async function claimIdempotencyKeys(
  deliveryId: string,
  semanticKey: string,
): Promise<IdempotencyResult> {
  const redis = getRedisConnection();
  await redis.connect().catch(() => {
    /* already connected */
  });

  const deliveryRedisKey = `${KEY_PREFIX}${deliveryIdempotencyKey(deliveryId)}`;
  const semanticRedisKey = `${KEY_PREFIX}${semanticIdempotencyRedisKey(semanticKey)}`;

  const pipeline = redis.multi();
  pipeline.set(deliveryRedisKey, "1", "EX", IDEMPOTENCY_TTL_SECONDS, "NX");
  pipeline.set(semanticRedisKey, deliveryId, "EX", IDEMPOTENCY_TTL_SECONDS, "NX");

  const results = await pipeline.exec();
  const deliverySet = results?.[0]?.[1] === "OK";
  const semanticSet = results?.[1]?.[1] === "OK";

  if (!deliverySet) {
    return {
      status: "duplicate",
      layer: "delivery",
      key: deliveryIdempotencyKey(deliveryId),
    };
  }

  if (!semanticSet) {
    await redis.del(deliveryRedisKey);
    return {
      status: "duplicate",
      layer: "semantic",
      key: semanticKey,
    };
  }

  return { status: "new" };
}

/** Release keys when enqueue fails so GitHub can retry the delivery. */
export async function releaseIdempotencyKeys(
  deliveryId: string,
  semanticKey: string,
): Promise<void> {
  const redis = getRedisConnection();
  await redis.del(
    `${KEY_PREFIX}${deliveryIdempotencyKey(deliveryId)}`,
    `${KEY_PREFIX}${semanticIdempotencyRedisKey(semanticKey)}`,
  );
}
