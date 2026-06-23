import { NextResponse } from "next/server";
import { getConnectedRepos } from "@/lib/dashboard/get-connected-repos";
import { requireDashboardAuth } from "@/lib/dashboard/require-dashboard-auth";
import { fetchNewContributorStats } from "@/lib/github/fetch-new-contributors";
import type { DashboardContributorsResponse } from "@/types/dashboard";

export const dynamic = "force-dynamic";

/** New contributor totals and per-project breakdown for connected repositories. */
export async function GET() {
  try {
    const authResult = await requireDashboardAuth();
    if (!authResult.ok) {
      return authResult.response;
    }

    const { user, githubToken, supabase } = authResult.auth;
    const projects = await getConnectedRepos(supabase, user.id);
    const stats = await fetchNewContributorStats(projects, githubToken);

    const body: DashboardContributorsResponse = {
      newContributors: stats.total,
      projects: stats.byProject,
    };

    return NextResponse.json(body);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 },
    );
  }
}
