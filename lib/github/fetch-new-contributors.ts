import type { ConnectedProject } from "@/types/dashboard";

export const NEW_CONTRIBUTOR_WINDOW_DAYS = 30;

type GitHubCommit = {
  commit: {
    author?: { date?: string };
    committer?: { date?: string };
  };
  author?: { login?: string | null } | null;
};

export type NewContributorStats = {
  total: number;
  byProject: Array<{
    name: string;
    contributors: number;
  }>;
};

function githubRestHeaders(token: string): HeadersInit {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

function getCommitLogin(commit: GitHubCommit): string | null {
  const login = commit.author?.login?.trim();
  return login || null;
}

function getCommitDate(commit: GitHubCommit): Date | null {
  const raw =
    commit.commit.author?.date ?? commit.commit.committer?.date ?? null;
  return raw ? new Date(raw) : null;
}

async function fetchCommitsPage(
  fullName: string,
  since: Date,
  token: string,
  page: number,
): Promise<GitHubCommit[]> {
  const [owner, repo] = fullName.split("/");
  const params = new URLSearchParams({
    since: since.toISOString(),
    per_page: "100",
    page: String(page),
  });

  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/commits?${params}`,
    {
      headers: githubRestHeaders(token),
      cache: "no-store",
    },
  );

  if (res.status === 409 || res.status === 404) {
    return [];
  }

  if (!res.ok) {
    throw new Error(
      `GitHub commits request failed for ${fullName} (${res.status})`,
    );
  }

  return (await res.json()) as GitHubCommit[];
}

/**
 * Unique commit author logins within [rangeStart, rangeEnd).
 * Uses the commits API with client-side date filtering for the upper bound.
 */
async function fetchAuthorsInRange(
  fullName: string,
  rangeStart: Date,
  rangeEnd: Date,
  token: string,
): Promise<Set<string>> {
  const authors = new Set<string>();
  const maxPages = 5;

  for (let page = 1; page <= maxPages; page += 1) {
    const commits = await fetchCommitsPage(fullName, rangeStart, token, page);
    if (commits.length === 0) {
      break;
    }

    for (const commit of commits) {
      const commitDate = getCommitDate(commit);
      if (!commitDate || commitDate >= rangeEnd) {
        continue;
      }

      if (commitDate < rangeStart) {
        continue;
      }

      const login = getCommitLogin(commit);
      if (login) {
        authors.add(login);
      }
    }

    const oldestOnPage = getCommitDate(commits[commits.length - 1]);
    if (!oldestOnPage || oldestOnPage < rangeStart || commits.length < 100) {
      break;
    }
  }

  return authors;
}

function subtractDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() - days);
  return result;
}

async function fetchNewContributorsForRepo(
  fullName: string,
  token: string,
  now: Date,
): Promise<Set<string>> {
  const recentStart = subtractDays(now, NEW_CONTRIBUTOR_WINDOW_DAYS);
  const previousStart = subtractDays(now, NEW_CONTRIBUTOR_WINDOW_DAYS * 2);

  const [recentAuthors, previousAuthors] = await Promise.all([
    fetchAuthorsInRange(fullName, recentStart, now, token),
    fetchAuthorsInRange(fullName, previousStart, recentStart, token),
  ]);

  const newAuthors = new Set<string>();
  for (const login of recentAuthors) {
    if (!previousAuthors.has(login)) {
      newAuthors.add(login);
    }
  }

  return newAuthors;
}

/**
 * New contributors across connected repositories.
 * A contributor is "new" when they committed in the last 30 days but not in the prior 30 days.
 */
export async function fetchNewContributorStats(
  projects: ConnectedProject[],
  token: string,
): Promise<NewContributorStats> {
  if (projects.length === 0) {
    return { total: 0, byProject: [] };
  }

  const now = new Date();
  const allNew = new Set<string>();
  const byProject: NewContributorStats["byProject"] = [];

  await Promise.all(
    projects.map(async (project) => {
      try {
        const newAuthors = await fetchNewContributorsForRepo(
          project.fullName,
          token,
          now,
        );

        for (const login of newAuthors) {
          allNew.add(login);
        }

        byProject.push({
          name: project.title,
          contributors: newAuthors.size,
        });
      } catch (error) {
        console.warn(
          `[dashboard] new contributors failed for ${project.fullName}:`,
          error,
        );
        byProject.push({
          name: project.title,
          contributors: 0,
        });
      }
    }),
  );

  byProject.sort((a, b) => a.name.localeCompare(b.name));

  return {
    total: allNew.size,
    byProject,
  };
}
