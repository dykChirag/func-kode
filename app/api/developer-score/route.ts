import { NextResponse } from "next/server";
import {
  buildEmptyDeveloperScore,
  mapDeveloperScoreRow,
  type DeveloperLatestScoreRow,
} from "@/lib/scoring/map-developer-score-row";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("developer_latest_scores")
      .select("*")
      .eq("developer_id", user.id)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    const score = data
      ? mapDeveloperScoreRow(data as DeveloperLatestScoreRow)
      : buildEmptyDeveloperScore(user.id);

    return NextResponse.json({ score });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
