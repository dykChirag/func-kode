import { createHmac, timingSafeEqual } from "crypto";

const SIGNATURE_HEADER = "x-hub-signature-256";
const LEGACY_SIGNATURE_HEADER = "x-hub-signature";

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");
  if (bufA.length !== bufB.length) {
    return false;
  }
  return timingSafeEqual(bufA, bufB);
}

function verifyHmac(
  rawBody: string,
  signatureHeader: string | null,
  secret: string,
  algorithm: "sha256" | "sha1",
): boolean {
  if (!signatureHeader) {
    return false;
  }

  const prefix = algorithm === "sha256" ? "sha256=" : "sha1=";
  if (!signatureHeader.startsWith(prefix)) {
    return false;
  }

  const expected = signatureHeader.slice(prefix.length);
  const digest = createHmac(algorithm, secret).update(rawBody, "utf8").digest("hex");

  return safeEqual(expected, digest);
}

export type WebhookVerificationResult =
  | { valid: true }
  | { valid: false; reason: string };

/**
 * Validates GitHub webhook HMAC signature (prefers SHA-256).
 * @see https://docs.github.com/en/webhooks/using-webhooks/securing-your-webhooks
 */
export function verifyGitHubWebhookSignature(
  rawBody: string,
  headers: Headers,
): WebhookVerificationResult {
  const secret = process.env.GITHUB_WEBHOOK_SECRET?.trim();
  if (!secret) {
    return { valid: false, reason: "GITHUB_WEBHOOK_SECRET is not configured" };
  }

  const sha256 = headers.get(SIGNATURE_HEADER);
  if (sha256 && verifyHmac(rawBody, sha256, secret, "sha256")) {
    return { valid: true };
  }

  const sha1 = headers.get(LEGACY_SIGNATURE_HEADER);
  if (sha1 && verifyHmac(rawBody, sha1, secret, "sha1")) {
    return { valid: true };
  }

  return { valid: false, reason: "Invalid or missing webhook signature" };
}
