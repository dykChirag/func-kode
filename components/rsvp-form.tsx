"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ANALYTICS_EVENTS, track } from "@/lib/analytics";

interface RsvpFormProps {
  eventId: string;
  eventName: string;
  userId: string;
}

/**
 * RsvpForm — client component (Issue #121)
 *
 * - Required field validation (name cannot be empty)
 * - Supabase rsvp_responses upsert (event_id + user_id unique — no 23505 crash on duplicate)
 * - Loading state, success confirmation, error path preserves form state
 * - RSVP_STARTED + RSVP_SUBMITTED analytics events
 */
export function RsvpForm({ eventId, eventName, userId }: RsvpFormProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [nameError, setNameError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    setNameError("");

    if (!name.trim()) {
      setNameError("Your name is required.");
      return;
    }

    setLoading(true);
    track(ANALYTICS_EVENTS.RSVP_STARTED, { event_id: eventId });

    try {
      const supabase = createClient();

      // upsert on (event_id, user_id) so duplicate RSVPs are handled gracefully
      const { error } = await supabase.from("rsvp_responses").upsert(
        {
          event_id: eventId,
          user_id: userId,
          name: name.trim(),
          notes: notes.trim() || null,
        },
        { onConflict: "event_id,user_id" },
      );

      if (error) {
        setSubmitError(`Failed to submit RSVP: ${error.message}`);
        track(ANALYTICS_EVENTS.RSVP_SUBMITTED, { success: false, error: error.message });
        return;
      }

      track(ANALYTICS_EVENTS.RSVP_SUBMITTED, { success: true, event_id: eventId });
      setSuccess(true);
      setTimeout(() => router.push("/events"), 2000);
    } catch (err) {
      setSubmitError(
        `Unexpected error: ${err instanceof Error ? err.message : "Please try again."}`,
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="rounded-xl border border-green-500/30 bg-green-500/10 px-6 py-8 text-center">
        <p className="text-lg font-bold text-green-400">🎉 RSVP confirmed!</p>
        <p className="mt-2 text-sm text-white/60">
          You&apos;re registered for <span className="text-white/90 font-semibold">{eventName}</span>.
          Redirecting to events…
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-5 rounded-xl border border-white/10 bg-white/5 p-6 sm:p-8"
    >
      {/* Name */}
      <div>
        <label htmlFor="rsvp-name" className="mb-1.5 block text-sm font-semibold text-white">
          Your Name <span className="text-red-400">*</span>
        </label>
        <input
          id="rsvp-name"
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (nameError) setNameError("");
          }}
          placeholder="e.g. Chirag Reddy"
          disabled={loading}
          className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none transition focus:border-white/40 focus:ring-1 focus:ring-white/20 disabled:opacity-60"
        />
        {nameError && (
          <p className="mt-1 text-xs text-destructive" role="alert">
            {nameError}
          </p>
        )}
      </div>

      {/* Notes (optional) */}
      <div>
        <label htmlFor="rsvp-notes" className="mb-1.5 block text-sm font-semibold text-white">
          Notes
          <span className="ml-1 text-xs font-normal text-white/40">(optional)</span>
        </label>
        <textarea
          id="rsvp-notes"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Anything you'd like us to know?"
          disabled={loading}
          className="w-full resize-none rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none transition focus:border-white/40 focus:ring-1 focus:ring-white/20 disabled:opacity-60"
        />
      </div>

      {submitError && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400" role="alert">
          {submitError}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold tracking-tight text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/20 border-t-black" />
            Submitting RSVP…
          </>
        ) : (
          "Confirm RSVP"
        )}
      </button>
    </form>
  );
}
