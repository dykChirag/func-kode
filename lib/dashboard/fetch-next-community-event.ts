import type { SupabaseClient } from "@supabase/supabase-js";
import type { DashboardNextEvent } from "@/types/dashboard";

type EventRow = {
  name: string;
  date: string;
};

/** Nearest upcoming community event from the events table. */
export async function fetchNextCommunityEvent(
  supabase: SupabaseClient,
): Promise<DashboardNextEvent | null> {
  const { data, error } = await supabase
    .from("events")
    .select("name, date")
    .eq("is_upcoming", true)
    .eq("is_community_event", true)
    .gte("date", new Date().toISOString())
    .order("date", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    return null;
  }

  const row = data as EventRow;
  return {
    title: row.name,
    date: row.date,
  };
}
