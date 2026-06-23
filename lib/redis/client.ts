import { Redis, type RedisOptions } from "ioredis";

let sharedConnection: Redis | null = null;

function getRedisUrl(): string {
  const url = process.env.REDIS_URL;
  if (!url) {
    throw new Error(
      "Missing REDIS_URL — required for webhook queue and idempotency",
    );
  }
  return url;
}

/** Parse rediss:// or redis:// URL into ioredis / BullMQ connection options. */
export function getRedisConnectionOptions(): RedisOptions {
  const parsed = new URL(getRedisUrl());

  return {
    host: parsed.hostname,
    port: parsed.port ? Number(parsed.port) : 6379,
    username: parsed.username || undefined,
    password: parsed.password ? decodeURIComponent(parsed.password) : undefined,
    tls: parsed.protocol === "rediss:" ? {} : undefined,
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    lazyConnect: true,
  };
}

/** ioredis client for idempotency and direct Redis commands. */
export function getRedisConnection(): Redis {
  if (!sharedConnection) {
    sharedConnection = new Redis(getRedisConnectionOptions());
  }
  return sharedConnection;
}

export async function closeRedisConnection(): Promise<void> {
  if (sharedConnection) {
    await sharedConnection.quit();
    sharedConnection = null;
  }
}

export function isRedisConfigured(): boolean {
  return Boolean(process.env.REDIS_URL);
}
