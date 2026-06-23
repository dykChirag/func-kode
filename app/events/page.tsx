import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";

/**
 * /events — Events listing page (Issue #121)
 *
 * Fetches from Supabase `events` table ordered by event_date asc.
 * Shows a real empty state if no events exist.
 * No auth required to view the listing.
 */
export default async function EventsPage() {
  const supabase = await createServerSupabaseClient();

  const { data: events, error } = await supabase
    .from("events")
    .select("id, name, event_date, location, format, description")
    .order("event_date", { ascending: true });

  return (
    <main className="min-h-screen bg-[#040710] px-5 py-12 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Events
        </h1>
        <p className="mb-8 text-sm text-white/60">
          Upcoming func(kode) community events.
        </p>

        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm text-red-400">
            Failed to load events. Please try again later.
          </div>
        )}

        {!error && (!events || events.length === 0) && (
          <div className="rounded-xl border border-white/10 bg-white/5 px-6 py-12 text-center">
            <p className="text-lg font-semibold text-white/80">No events yet</p>
            <p className="mt-2 text-sm text-white/40">
              Check back soon — community events will appear here.
            </p>
          </div>
        )}

        {events && events.length > 0 && (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <li key={event.id}>
                <Link
                  href={`/events/${event.id}`}
                  className="group flex h-full flex-col rounded-xl border border-white/10 bg-white/5 p-5 transition hover:border-white/25 hover:bg-white/10"
                >
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <span className="inline-flex items-center rounded-full border border-white/15 px-2.5 py-0.5 text-xs font-semibold text-white/70 capitalize">
                      {event.format ?? "in-person"}
                    </span>
                  </div>
                  <h2 className="mb-1.5 text-base font-bold text-white group-hover:text-white/90">
                    {event.name}
                  </h2>
                  {event.description && (
                    <p className="mb-3 line-clamp-2 text-sm text-white/50">
                      {event.description}
                    </p>
                  )}
                  <div className="mt-auto space-y-1 text-xs text-white/40">
                    {event.event_date && (
                      <p>
                        📅{" "}
                        {new Date(event.event_date).toLocaleDateString("en-IN", {
                          dateStyle: "medium",
                        })}
                      </p>
                    )}
                    {event.location && <p>📍 {event.location}</p>}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
