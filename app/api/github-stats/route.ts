import { getGitHubStats } from "@/lib/github-stats";

export const revalidate = 3600;

export async function GET() {
  const stats = await getGitHubStats();
  const failed = stats.forks === null && stats.stars === null;

  return Response.json(stats, {
    headers: failed ? { "Cache-Control": "no-store" } : undefined,
  });
}
