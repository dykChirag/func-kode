export const GITHUB_REPO = "patchid/func-kode";

export type GitHubStats = {
  forks: number | null;
  stars: number | null;
  repo: string;
};

const FALLBACK_STATS: GitHubStats = {
  forks: null,
  stars: null,
  repo: GITHUB_REPO,
};

function githubApiHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    // Required by GitHub REST API — Cloudflare Workers omit a User-Agent by default.
    "User-Agent": "func-kode-stats",
  };

  const token = process.env.GITHUB_TOKEN?.trim();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

export async function getGitHubStats(): Promise<GitHubStats> {
  try {
    const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}`, {
      headers: githubApiHeaders(),
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      console.warn(
        `[github-stats] GitHub API ${res.status} ${res.statusText}`,
      );
      return FALLBACK_STATS;
    }

    const data = await res.json();
    return {
      forks: typeof data.forks_count === "number" ? data.forks_count : null,
      stars:
        typeof data.stargazers_count === "number"
          ? data.stargazers_count
          : null,
      repo: GITHUB_REPO,
    };
  } catch (error) {
    console.warn("[github-stats] GitHub API request failed", error);
    return FALLBACK_STATS;
  }
}

/** Non-blocking fetch with timeout — never delays root layout on slow GitHub API. */
export async function getGitHubStatsSafe(
  timeoutMs = 500,
): Promise<GitHubStats> {
  return Promise.race([
    getGitHubStats(),
    new Promise<GitHubStats>((resolve) =>
      setTimeout(() => resolve(FALLBACK_STATS), timeoutMs),
    ),
  ]).catch(() => FALLBACK_STATS);
}
