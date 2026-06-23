export type ParsedGitHubRepo = {
  owner: string;
  repo: string;
  fullName: string;
};

/** Extract owner/repo from a GitHub repository URL. */
export function parseGitHubRepoUrl(url: string): ParsedGitHubRepo | null {
  try {
    const parsed = new URL(url.trim());
    if (!["github.com", "www.github.com"].includes(parsed.host)) {
      return null;
    }

    const segments = parsed.pathname.split("/").filter(Boolean);
    if (segments.length < 2) {
      return null;
    }

    const [owner, rawRepo] = segments;
    const repo = rawRepo.replace(/\.git$/i, "");
    if (!owner || !repo) {
      return null;
    }

    return { owner, repo, fullName: `${owner}/${repo}` };
  } catch {
    return null;
  }
}
