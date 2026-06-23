import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { RsvpForm } from "@/components/rsvp-form";

/**
 * /rsvp?eventId=[id] — RSVP page (Issue #121)
 *
 * Auth guard: unauthenticated users are redirected to login.
 * Prefetches the event name so the form can display it.
 * Invalid eventId → notFound().
 */
export default async function RsvpPage({
  searchParams,
}: {
  searchParams: Promise<{ eventId?: string }>;
}) {
  const { eventId } = await searchParams;

  if (!eventId) {
    notFound();
  }

  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect(`/auth/login?redirect=/rsvp?eventId=${eventId}`);
  }

  const { data: event } = await supabase
    .from("events")
    .select("id, name")
    .eq("id", eventId)
    .maybeSingle();

  if (!event) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#040710] px-5 py-12 sm:px-8">
      <div className="mx-auto max-w-xl">
        <h1 className="mb-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
          RSVP
        </h1>
        <p className="mb-8 text-sm text-white/60">
          You&apos;re RSVPing for:{" "}
          <span className="font-semibold text-white/90">{event.name}</span>
        </p>
        <RsvpForm eventId={event.id} eventName={event.name} userId={user.id} />
      </div>
    </main>
  );
}
