import { NextResponse } from "next/server";
import { fetchNextCommunityEvent } from "@/lib/dashboard/fetch-next-community-event";
import { getConnectedRepos } from "@/lib/dashboard/get-connected-repos";
import { requireDashboardAuth } from "@/lib/dashboard/require-dashboard-auth";
import { fetchNewContributorStats } from "@/lib/github/fetch-new-contributors";
import { fetchPendingReviewCount } from "@/lib/github/fetch-pending-reviews";
import type { DashboardSummaryResponse } from "@/types/dashboard";

export const dynamic = "force-dynamic";

/**
 * Dashboard morning summary: new contributors, pending PR reviews, next community event.
 */
export async function GET() {
  try {
    const authResult = await requireDashboardAuth();
    if (!authResult.ok) {
      return authResult.response;
    }

    const { user, githubToken, supabase } = authResult.auth;

    const projects = await getConnectedRepos(supabase, user.id);

    const [contributorStats, pendingReviews, nextEvent] = await Promise.all([
      fetchNewContributorStats(projects, githubToken),
      fetchPendingReviewCount(githubToken).catch((error) => {
        console.warn("[dashboard/summary] pending reviews failed:", error);
        return 0;
      }),
      fetchNextCommunityEvent(supabase),
    ]);

    const body: DashboardSummaryResponse = {
      newContributors: contributorStats.total,
      pendingReviews,
      nextEvent,
    };

    return NextResponse.json(body);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 },
    );
  }
}
