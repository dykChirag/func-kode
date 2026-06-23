import { notFound } from "next/navigation";
import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";

/**
 * /events/[id] — Event detail page (Issue #121)
 *
 * Fetches event by id from Supabase.
 * Invalid id → notFound() (404 page, not a crash or blank screen).
 * RSVP CTA links to /rsvp?eventId=[id].
 */
export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();

  const { data: event, error } = await supabase
    .from("events")
    .select("id, name, event_date, event_time, location, format, description")
    .eq("id", id)
    .maybeSingle();

  if (error || !event) {
    notFound();
  }

  const dateStr = event.event_date
    ? new Date(event.event_date).toLocaleDateString("en-IN", { dateStyle: "long" })
    : null;

  const timeStr = event.event_time ?? null;

  return (
    <main className="min-h-screen bg-[#040710] px-5 py-12 sm:px-8">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/events"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white/80 transition"
        >
          ← All Events
        </Link>

        <div className="rounded-xl border border-white/10 bg-white/5 p-6 sm:p-8">
          {/* Format badge */}
          {event.format && (
            <span className="mb-4 inline-flex items-center rounded-full border border-white/15 px-2.5 py-0.5 text-xs font-semibold text-white/60 capitalize">
              {event.format}
            </span>
          )}

          <h1 className="mb-4 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {event.name}
          </h1>

          {/* Meta row */}
          <div className="mb-6 flex flex-wrap gap-4 text-sm text-white/50">
            {dateStr && (
              <span className="flex items-center gap-1.5">
                <span>📅</span> {dateStr}
                {timeStr && <span>· {timeStr}</span>}
              </span>
            )}
            {event.location && (
              <span className="flex items-center gap-1.5">
                <span>📍</span> {event.location}
              </span>
            )}
          </div>

          {/* Description */}
          {event.description && (
            <p className="mb-8 text-base leading-relaxed text-white/80">
              {event.description}
            </p>
          )}

          {/* RSVP CTA */}
          <Link
            href={`/rsvp?eventId=${event.id}`}
            className="inline-flex h-11 min-w-[140px] items-center justify-center rounded-full bg-white px-6 text-sm font-bold tracking-tight text-black transition hover:opacity-90"
          >
            RSVP for this event
          </Link>
        </div>
      </div>
    </main>
  );
}
