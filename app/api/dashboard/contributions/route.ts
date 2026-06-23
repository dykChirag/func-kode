import { NextResponse } from "next/server";
import { requireDashboardAuth } from "@/lib/dashboard/require-dashboard-auth";
import { fetchContributionCalendar } from "@/lib/github/fetch-contribution-calendar";

export const dynamic = "force-dynamic";

/** Last 12 months of GitHub contribution activity for the authenticated user. */
export async function GET() {
  try {
    const authResult = await requireDashboardAuth();
    if (!authResult.ok) {
      return authResult.response;
    }

    const calendar = await fetchContributionCalendar(authResult.auth.githubToken);
    return NextResponse.json(calendar);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 },
    );
  }
}
