"use client";

/**
 * ContactForm — UI shell only (issue #126).
 *
 * TODO(#129): Wire Supabase contact_messages insert + PostHog contact_submitted event.
 */
export function ContactForm() {
  return (
    <form
      className="mx-auto flex flex-col items-center justify-center gap-4 sm:flex-row sm:items-center"
      onSubmit={(e) => e.preventDefault()}
      aria-label="Contact form"
    >
      <label className="sr-only" htmlFor="contact-message">
        Message
      </label>
      <input
        id="contact-message"
        type="text"
        name="message"
        placeholder="Contact Us"
        className="
          h-[52px] w-full rounded-full border-2 border-landing-card-border
          bg-white px-6 text-base text-black outline-none
          placeholder:text-black/40
          focus-visible:ring-2 focus-visible:ring-black/20
          sm:w-[320px]
        "
        disabled
        aria-disabled="true"
      />
      <button
        type="submit"
        className="
          inline-flex h-[52px] shrink-0 items-center justify-center
          rounded-full bg-black px-8 text-sm font-bold tracking-landing-cta text-white
          transition-opacity hover:opacity-90
        "
        disabled
        aria-disabled="true"
      >
        SEND
      </button>
    </form>
  );
}
