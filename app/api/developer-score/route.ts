import { NextResponse } from "next/server";
import {
  buildEmptyDeveloperScore,
  mapDeveloperScoreRow,
  type DeveloperLatestScoreRow,
} from "@/lib/scoring/map-developer-score-row";
import { createServerSupabaseClient } from "@/lib/supabase/server";

// Prevent Next.js from statically rendering this route — scores are user-specific.
export const dynamic = "force-dynamic";

/**
 * GET /api/developer-score
 *
 * Returns the authenticated developer's latest Patch ID trust score.
 * Reads from the `developer_latest_scores` view (DISTINCT ON developer_id
 * ordered by computed_at DESC) so it always returns the freshest snapshot.
 *
 * Response shape:
 *   200 { score: DeveloperScore }
 *   401 { error: "Unauthorized" }
 *   500 { error: string }
 */
export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("developer_latest_scores")
      .select(
        "id, developer_id, score_version, score_total, " +
          "merge_quality_score, review_participation_score, consistency_score, " +
          "pr_hygiene_score, recent_activity_score, metrics_json, " +
          "sufficient_data, explanation, computed_at",
      )
      .eq("developer_id", user.id)
      .maybeSingle();

    if (error) {
      console.error("[api/developer-score] db error:", error.message);
      return NextResponse.json(
        { error: `Database error: ${error.message}` },
        { status: 500 },
      );
    }

    // `data` is null (no score yet) or a row object. The `if (error)` guard
    // above has already eliminated the GenericStringError branch, so casting
    // via `unknown` first is the correct and type-safe pattern here.
    const score = data
      ? mapDeveloperScoreRow(data as unknown as DeveloperLatestScoreRow)
      : buildEmptyDeveloperScore(user.id);

    return NextResponse.json(
      { score },
      {
        status: 200,
        headers: {
          // Score is personal — never share across users
          "Cache-Control": "private, no-store",
        },
      },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected error";
    console.error("[api/developer-score] unhandled:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
