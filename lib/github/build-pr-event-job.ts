import { createClient } from "@supabase/supabase-js";
import { analyzeChangedPaths } from "@/lib/github/pr-path-analysis";
import type { PrEventJob, PrEventType } from "@/lib/github/pr-event-types";

type GitHubUser = { login?: string };
type GitHubLabel = { name?: string };
type GitHubRef = { ref?: string; sha?: string };
type GitHubPullRequest = {
  id: number;
  number: number;
  title: string;
  body: string | null;
  state: string;
  merged: boolean;
  merged_at: string | null;
  created_at: string;
  updated_at: string;
  additions?: number;
  deletions?: number;
  changed_files?: number;
  commits?: number;
  user?: GitHubUser;
  base?: GitHubRef;
  head?: GitHubRef;
  labels?: GitHubLabel[];
  requested_reviewers?: GitHubUser[];
};

type GitHubReview = {
  id: number;
  state: string;
  user?: GitHubUser;
};

type GitHubRepository = {
  full_name?: string;
};

type GitHubWebhookPayload = {
  action?: string;
  number?: number;
  pull_request?: GitHubPullRequest;
  review?: GitHubReview;
  repository?: GitHubRepository;
};

type GitHubPullFile = {
  filename: string;
  additions: number;
  deletions: number;
  changes: number;
};

function githubHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "func-kode-webhook",
  };
  const token = process.env.GITHUB_TOKEN?.trim();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, { headers: githubHeaders() });
    if (!res.ok) {
      console.warn(`[github-enrich] ${res.status} ${url}`);
      return null;
    }
    return (await res.json()) as T;
  } catch (error) {
    console.warn("[github-enrich] fetch failed", url, error);
    return null;
  }
}

async function resolveDeveloperId(githubUsername: string): Promise<string | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    return null;
  }

  const supabase = createClient(supabaseUrl, serviceKey);
  const { data } = await supabase
    .from("profiles")
    .select("id")
    .eq("github_username", githubUsername)
    .maybeSingle();

  return data?.id ?? null;
}

export function mapPullRequestEventType(
  action: string,
  merged: boolean,
): PrEventType | null {
  switch (action) {
    case "opened":
    case "reopened":
    case "ready_for_review":
      return "opened";
    case "synchronize":
      return "synchronized";
    case "edited":
    case "labeled":
    case "unlabeled":
    case "review_requested":
    case "review_request_removed":
      return "edited";
    case "closed":
      return merged ? "merged" : "closed";
    default:
      return null;
  }
}

export function buildIdempotencyKey(
  githubPrId: number,
  headSha: string,
  eventType: PrEventType,
  suffix?: string,
): string {
  const base = `${githubPrId}:${headSha}:${eventType}`;
  return suffix ? `${base}:${suffix}` : base;
}

export function isSupportedWebhook(
  githubEvent: string,
  action: string | undefined,
  merged?: boolean,
): boolean {
  if (githubEvent === "pull_request_review" && action === "submitted") {
    return true;
  }
  if (githubEvent === "pull_request" && action) {
    return mapPullRequestEventType(action, merged ?? false) !== null;
  }
  return false;
}

async function enrichFromGitHubApi(
  repoName: string,
  prNumber: number,
  pr: GitHubPullRequest,
): Promise<{
  additions: number | null;
  deletions: number | null;
  changed_files: number | null;
  commits_count: number | null;
  review_count: number | null;
  filePaths: string[];
}> {
  const [pullDetail, files, reviews, commits] = await Promise.all([
    fetchJson<GitHubPullRequest>(
      `https://api.github.com/repos/${repoName}/pulls/${prNumber}`,
    ),
    fetchJson<GitHubPullFile[]>(
      `https://api.github.com/repos/${repoName}/pulls/${prNumber}/files?per_page=100`,
    ),
    fetchJson<GitHubReview[]>(
      `https://api.github.com/repos/${repoName}/pulls/${prNumber}/reviews?per_page=100`,
    ),
    fetchJson<{ sha: string }[]>(
      `https://api.github.com/repos/${repoName}/pulls/${prNumber}/commits?per_page=100`,
    ),
  ]);

  const detail = pullDetail ?? pr;
  const filePaths = (files ?? []).map((file) => file.filename);

  let additions = detail.additions ?? null;
  let deletions = detail.deletions ?? null;
  let changed_files = detail.changed_files ?? null;

  if (files?.length) {
    if (additions === null || additions === 0) {
      additions = files.reduce((sum, file) => sum + file.additions, 0);
    }
    if (deletions === null || deletions === 0) {
      deletions = files.reduce((sum, file) => sum + file.deletions, 0);
    }
    if (changed_files === null || changed_files === 0) {
      changed_files = files.length;
    }
  }

  return {
    additions,
    deletions,
    changed_files,
    commits_count: commits?.length ?? detail.commits ?? null,
    review_count: reviews?.length ?? null,
    filePaths,
  };
}

export async function buildPrEventJob(params: {
  githubEvent: string;
  payload: GitHubWebhookPayload;
  deliveryId: string;
}): Promise<PrEventJob | null> {
  const { githubEvent, payload, deliveryId } = params;
  const action = payload.action ?? "unknown";
  const pr = payload.pull_request;
  const repoName = payload.repository?.full_name;

  if (!pr || !repoName) {
    return null;
  }

  let eventType: PrEventType | null = null;
  if (githubEvent === "pull_request_review" && action === "submitted") {
    eventType = "reviewed";
  } else if (githubEvent === "pull_request") {
    eventType = mapPullRequestEventType(action, pr.merged ?? false);
  }

  if (!eventType) {
    return null;
  }

  const authorUsername = pr.user?.login ?? "unknown";
  const headSha = pr.head?.sha ?? "unknown";
  const githubPrId = pr.id;
  const prNumber = pr.number ?? payload.number ?? 0;

  const [developerId, enrichment] = await Promise.all([
    resolveDeveloperId(authorUsername),
    enrichFromGitHubApi(repoName, prNumber, pr),
  ]);

  const pathFlags = analyzeChangedPaths(enrichment.filePaths);

  return {
    id: crypto.randomUUID(),
    developer_id: developerId,
    repo_name: repoName,
    pr_number: prNumber,
    github_pt_id: githubPrId,
    event_type: eventType,
    title: pr.title,
    body: pr.body,
    author_username: authorUsername,
    base_branch: pr.base?.ref ?? "",
    head_branch: pr.head?.ref ?? "",
    head_sha: headSha,
    additions: enrichment.additions,
    deletions: enrichment.deletions,
    changed_files: enrichment.changed_files,
    commits_count: enrichment.commits_count,
    review_count: enrichment.review_count,
    requested_reviewers_count: pr.requested_reviewers?.length ?? null,
    labels_json: pr.labels?.length ? JSON.stringify(pr.labels) : null,
    tests_touched: pathFlags.tests_touched,
    docs_touched: pathFlags.docs_touched,
    risky_paths_hit: pathFlags.risky_paths_hit,
    state: pr.state,
    merged_at: pr.merged_at,
    created_at: pr.created_at,
    updated_at: pr.updated_at,
    ingested_at: new Date().toISOString(),
    delivery_id: deliveryId,
    idempotency_key: buildIdempotencyKey(
      githubPrId,
      headSha,
      eventType,
      githubEvent === "pull_request_review"
        ? String(payload.review?.id ?? deliveryId)
        : undefined,
    ),
    github_event: githubEvent,
    github_action: action,
  };
}
