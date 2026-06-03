export const GITHUB_REPO = "patchid/func-kode";

export type GitHubStats = {
  forks: number | null;
  stars: number | null;
  repo: string;
};

export async function getGitHubStats(): Promise<GitHubStats> {
  try {
    const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}`, {
      headers: { Accept: "application/vnd.github+json" },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return { forks: null, stars: null, repo: GITHUB_REPO };
    }

    const data = await res.json();
    return {
      forks: typeof data.forks_count === "number" ? data.forks_count : null,
      stars: typeof data.stargazers_count === "number" ? data.stargazers_count : null,
      repo: GITHUB_REPO,
    };
  } catch {
    return { forks: null, stars: null, repo: GITHUB_REPO };
  }
}
