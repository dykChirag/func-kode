#!/usr/bin/env node
/**
 * Send a signed test request to /api/github/webhook.
 *
 * Usage:
 *   node scripts/test-github-webhook.mjs                    # ping → localhost:3000
 *   node scripts/test-github-webhook.mjs ping               # ping
 *   node scripts/test-github-webhook.mjs pr                 # pull_request opened
 *   node scripts/test-github-webhook.mjs pr https://xxx.ngrok-free.app
 *
 * Reads GITHUB_WEBHOOK_SECRET from .env.local (or process.env).
 */
import { createHmac, randomUUID } from "crypto";
import { readFileSync } from "fs";
import { resolve } from "path";

function loadEnvLocal() {
  try {
    const raw = readFileSync(resolve(process.cwd(), ".env.local"), "utf8");
    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = value;
    }
  } catch {
    /* .env.local optional if env vars already set */
  }
}

function sign(body, secret) {
  const digest = createHmac("sha256", secret).update(body, "utf8").digest("hex");
  return `sha256=${digest}`;
}

const PING_PAYLOAD = {
  zen: "Manual curl test.",
  hook_id: 1,
  repository: { full_name: "patchid/func-kode" },
};

const PR_OPENED_PAYLOAD = {
  action: "opened",
  number: 1,
  pull_request: {
    id: 999001,
    number: 1,
    title: "Manual webhook test",
    body: "Triggered via scripts/test-github-webhook.mjs",
    state: "open",
    merged: false,
    merged_at: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user: { login: "test-user" },
    base: { ref: "main", sha: "base000" },
    head: { ref: "feature/test-webhook", sha: "head000abc123" },
    labels: [],
    requested_reviewers: [],
  },
  repository: { full_name: "patchid/func-kode" },
  sender: { login: "test-user" },
};

loadEnvLocal();

const secret = process.env.GITHUB_WEBHOOK_SECRET?.trim();
if (!secret) {
  console.error("GITHUB_WEBHOOK_SECRET is not set (.env.local or env)");
  process.exit(1);
}

const mode = (process.argv[2] ?? "ping").toLowerCase();
const baseUrl = (process.argv[3] ?? "http://localhost:3000").replace(/\/$/, "");
const url = `${baseUrl}/api/github/webhook`;

const isPing = mode === "ping";
const githubEvent = isPing ? "ping" : "pull_request";
const payload = isPing ? PING_PAYLOAD : PR_OPENED_PAYLOAD;
const body = JSON.stringify(payload);
const deliveryId = randomUUID();
const signature = sign(body, secret);

console.log(`POST ${url}`);
console.log(`X-GitHub-Event: ${githubEvent}`);
console.log(`X-GitHub-Delivery: ${deliveryId}`);
console.log("");

const res = await fetch(url, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-GitHub-Event": githubEvent,
    "X-GitHub-Delivery": deliveryId,
    "X-Hub-Signature-256": signature,
    "User-Agent": "GitHub-Hookshot/manual-test",
  },
  body,
});

const text = await res.text();
console.log(`Status: ${res.status}`);
try {
  console.log(JSON.stringify(JSON.parse(text), null, 2));
} catch {
  console.log(text.slice(0, 500));
}
