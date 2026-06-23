import { describe, expect, it } from "vitest";
import { createHmac } from "crypto";
import {
  buildSemanticIdempotencyKey,
  deliveryIdempotencyKey,
} from "@/lib/github/idempotency-key";
import {
  isSupportedPrWebhook,
  resolvePrEventType,
  resolvePullRequestEventType,
} from "@/lib/github/pr-event-support";
import { analyzeChangedPaths } from "@/lib/github/pr-path-analysis";
import { parseGitHubWebhookBody } from "@/lib/github/parse-webhook-body";
import { verifyGitHubWebhookSignature } from "@/lib/github/webhook-signature";
import {
  shouldMoveToDeadLetterQueue,
} from "@/lib/queue/move-to-dlq";
import { DEFAULT_JOB_ATTEMPTS } from "@/lib/queue/pr-events-dlq-types";

function signBody(body: string, secret: string): Headers {
  const digest = createHmac("sha256", secret).update(body, "utf8").digest("hex");
  return new Headers({ "x-hub-signature-256": `sha256=${digest}` });
}

describe("verifyGitHubWebhookSignature", () => {
  it("accepts valid SHA-256 signatures", () => {
    process.env.GITHUB_WEBHOOK_SECRET = "test-secret";
    const body = '{"action":"opened"}';
    expect(verifyGitHubWebhookSignature(body, signBody(body, "test-secret"))).toEqual({
      valid: true,
    });
  });

  it("rejects invalid signatures", () => {
    process.env.GITHUB_WEBHOOK_SECRET = "test-secret";
    const body = '{"action":"opened"}';
    const result = verifyGitHubWebhookSignature(
      body,
      new Headers({ "x-hub-signature-256": "sha256=deadbeef" }),
    );
    expect(result.valid).toBe(false);
  });
});

describe("PR event support", () => {
  it("supports pull_request lifecycle actions", () => {
    expect(isSupportedPrWebhook("pull_request", "opened")).toBe(true);
    expect(isSupportedPrWebhook("pull_request", "synchronize")).toBe(true);
    expect(isSupportedPrWebhook("pull_request", "labeled")).toBe(true);
    expect(isSupportedPrWebhook("pull_request", "closed", false)).toBe(true);
    expect(isSupportedPrWebhook("pull_request", "closed", true)).toBe(true);
    expect(isSupportedPrWebhook("pull_request_review", "submitted")).toBe(true);
    expect(isSupportedPrWebhook("push", "created")).toBe(false);
    expect(isSupportedPrWebhook("pull_request", "assigned")).toBe(false);
  });

  it("maps actions to internal event types", () => {
    expect(resolvePullRequestEventType("opened", false)).toBe("opened");
    expect(resolvePullRequestEventType("synchronize", false)).toBe("synchronized");
    expect(resolvePullRequestEventType("labeled", false)).toBe("edited");
    expect(resolvePullRequestEventType("closed", true)).toBe("merged");
    expect(resolvePullRequestEventType("closed", false)).toBe("closed");
    expect(resolvePrEventType("pull_request_review", "submitted", false)).toBe(
      "reviewed",
    );
  });
});

describe("idempotency keys", () => {
  it("uses sha-based keys for sync and lifecycle events", () => {
    expect(
      buildSemanticIdempotencyKey({
        githubPtId: 99,
        headSha: "abc",
        eventType: "synchronized",
        deliveryId: "del-1",
      }),
    ).toBe("pr:99:sha:abc:synchronized");

    expect(
      buildSemanticIdempotencyKey({
        githubPtId: 99,
        headSha: "abc",
        eventType: "merged",
        deliveryId: "del-2",
      }),
    ).toBe("pr:99:sha:abc:merged");
  });

  it("uses review id for reviewed events", () => {
    expect(
      buildSemanticIdempotencyKey({
        githubPtId: 99,
        headSha: "abc",
        eventType: "reviewed",
        deliveryId: "del-3",
        reviewId: 555,
      }),
    ).toBe("pr:99:review:555");
  });

  it("uses delivery id for edited events (multiple per sha)", () => {
    expect(
      buildSemanticIdempotencyKey({
        githubPtId: 99,
        headSha: "abc",
        eventType: "edited",
        deliveryId: "del-4",
      }),
    ).toBe("pr:99:delivery:del-4");
  });

  it("formats delivery layer keys", () => {
    expect(deliveryIdempotencyKey("72d3162e-cc78-11e3-81ab-4c9367dc0958")).toBe(
      "delivery:72d3162e-cc78-11e3-81ab-4c9367dc0958",
    );
  });
});

describe("dead letter queue", () => {
  it("moves to DLQ only after max attempts", () => {
    const job = {
      attemptsMade: DEFAULT_JOB_ATTEMPTS,
      opts: { attempts: DEFAULT_JOB_ATTEMPTS },
    };
    expect(shouldMoveToDeadLetterQueue(job as never)).toBe(true);

    const retrying = {
      attemptsMade: 2,
      opts: { attempts: DEFAULT_JOB_ATTEMPTS },
    };
    expect(shouldMoveToDeadLetterQueue(retrying as never)).toBe(false);
  });
});

describe("parseGitHubWebhookBody", () => {
  it("parses JSON bodies", () => {
    const body = JSON.stringify({ action: "opened" });
    expect(parseGitHubWebhookBody(body, "application/json")).toEqual({
      action: "opened",
    });
  });

  it("parses form-urlencoded bodies", () => {
    const json = JSON.stringify({ zen: "Accessible for all." });
    const body = `payload=${encodeURIComponent(json)}`;
    expect(
      parseGitHubWebhookBody(body, "application/x-www-form-urlencoded"),
    ).toEqual({ zen: "Accessible for all." });
  });
});

describe("analyzeChangedPaths", () => {
  it("flags tests, docs, and risky paths", () => {
    const result = analyzeChangedPaths([
      "lib/auth/login.ts",
      "docs/api/webhook.md",
      "tests/webhook.test.ts",
      ".env.example",
    ]);
    expect(result.tests_touched).toBe(true);
    expect(result.docs_touched).toBe(true);
    expect(result.risky_paths_hit).toBe(true);
  });
});
