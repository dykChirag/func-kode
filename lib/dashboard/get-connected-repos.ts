import type { SupabaseClient } from "@supabase/supabase-js";
import type { ConnectedProject } from "@/types/dashboard";
import { parseGitHubRepoUrl } from "@/lib/dashboard/parse-github-repo-url";

type ProjectRow = {
  id: string;
  title: string;
  github_url: string;
};

/** Connected repositories for the current user, sourced from projects.github_url. */
export async function getConnectedRepos(
  supabase: SupabaseClient,
  userId: string,
): Promise<ConnectedProject[]> {
  const { data, error } = await supabase
    .from("projects")
    .select("id, title, github_url")
    .eq("user_id", userId);

  if (error) {
    throw new Error(error.message);
  }

  const seen = new Set<string>();
  const projects: ConnectedProject[] = [];

  for (const row of (data ?? []) as ProjectRow[]) {
    const parsed = parseGitHubRepoUrl(row.github_url);
    if (!parsed || seen.has(parsed.fullName)) {
      continue;
    }

    seen.add(parsed.fullName);
    projects.push({
      projectId: row.id,
      title: row.title,
      githubUrl: row.github_url,
      fullName: parsed.fullName,
    });
  }

  return projects;
}
