"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ANALYTICS_EVENTS, track } from "@/lib/analytics";

type FieldErrors = {
  name?: string;
  email?: string;
  message?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * ContactForm — fully wired (Issue #129)
 *
 * Fields: Name (required), Email (required + format), Message (required, min 10 chars)
 * Supabase insert → contact_messages table (public insert, no auth required)
 * PostHog CONTACT_SUBMITTED on success only.
 * Accessible: labels, role="alert" error messages, aria-label on form.
 * Mobile-first: full-width inputs + button at 375px.
 */
export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  function validate(): FieldErrors {
    const e: FieldErrors = {};
    if (!name.trim()) e.name = "Name is required.";
    if (!email.trim()) {
      e.email = "Email is required.";
    } else if (!EMAIL_RE.test(email.trim())) {
      e.email = "Please enter a valid email address.";
    }
    if (!message.trim()) {
      e.message = "Message is required.";
    } else if (message.trim().length < 10) {
      e.message = "Message must be at least 10 characters.";
    }
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError("");

    const fieldErrors = validate();
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.from("contact_messages").insert({
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
      });

      if (error) {
        setSubmitError(`Something went wrong: ${error.message}`);
        return;
      }

      track(ANALYTICS_EVENTS.CONTACT_SUBMITTED, { has_email: true });
      setSuccess(true);
    } catch (err) {
      setSubmitError(
        `Unexpected error: ${err instanceof Error ? err.message : "Please try again."}`
      );
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="w-full max-w-[640px] rounded-2xl bg-black/10 px-6 py-8 text-center">
        <p className="text-xl font-bold text-[#0D0E14]">🎉 Thanks! We’ll be in touch.</p>
        <p className="mt-2 text-sm text-black/60">
          We’ve received your message and will get back to you soon.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-label="Contact us"
      className="flex w-full max-w-[640px] flex-col gap-4"
    >
      {/* Name */}
      <div className="flex flex-col gap-1 text-left">
        <label
          htmlFor="contact-name"
          className="text-sm font-semibold text-[#0D0E14]"
        >
          Name <span className="text-red-600">*</span>
        </label>
        <input
          id="contact-name"
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
          }}
          placeholder="Your name"
          disabled={loading}
          aria-describedby={errors.name ? "contact-name-error" : undefined}
          aria-invalid={!!errors.name}
          className="h-[52px] w-full rounded-full border-2 border-black/20 bg-white px-5 text-base text-black outline-none placeholder:text-black/40 focus-visible:ring-2 focus-visible:ring-black/30 disabled:opacity-60"
        />
        {errors.name && (
          <p id="contact-name-error" role="alert" className="text-xs text-destructive">
            {errors.name}
          </p>
        )}
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1 text-left">
        <label
          htmlFor="contact-email"
          className="text-sm font-semibold text-[#0D0E14]"
        >
          Email <span className="text-red-600">*</span>
        </label>
        <input
          id="contact-email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
          }}
          placeholder="you@example.com"
          disabled={loading}
          aria-describedby={errors.email ? "contact-email-error" : undefined}
          aria-invalid={!!errors.email}
          className="h-[52px] w-full rounded-full border-2 border-black/20 bg-white px-5 text-base text-black outline-none placeholder:text-black/40 focus-visible:ring-2 focus-visible:ring-black/30 disabled:opacity-60"
        />
        {errors.email && (
          <p id="contact-email-error" role="alert" className="text-xs text-destructive">
            {errors.email}
          </p>
        )}
      </div>

      {/* Message */}
      <div className="flex flex-col gap-1 text-left">
        <label
          htmlFor="contact-message"
          className="text-sm font-semibold text-[#0D0E14]"
        >
          Message <span className="text-red-600">*</span>
        </label>
        <textarea
          id="contact-message"
          rows={4}
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            if (errors.message) setErrors((prev) => ({ ...prev, message: undefined }));
          }}
          placeholder="What would you like to tell us? (min 10 characters)"
          disabled={loading}
          aria-describedby={errors.message ? "contact-message-error" : undefined}
          aria-invalid={!!errors.message}
          className="w-full resize-none rounded-2xl border-2 border-black/20 bg-white px-5 py-3 text-base text-black outline-none placeholder:text-black/40 focus-visible:ring-2 focus-visible:ring-black/30 disabled:opacity-60"
        />
        {errors.message && (
          <p id="contact-message-error" role="alert" className="text-xs text-destructive">
            {errors.message}
          </p>
        )}
      </div>

      {/* Submit error */}
      {submitError && (
        <div
          role="alert"
          className="rounded-xl border border-red-400/30 bg-red-100/60 px-4 py-3 text-sm text-red-700"
        >
          {submitError}
        </div>
      )}

      {/* Submit button */}
      <button
        type="submit"
        disabled={loading}
        className="
          inline-flex h-[52px] w-full items-center justify-center gap-2
          rounded-full bg-black px-8 text-sm font-bold tracking-landing-cta text-white
          transition-opacity hover:opacity-90
          disabled:cursor-not-allowed disabled:opacity-60
          sm:w-auto sm:self-center
        "
      >
        {loading ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            Sending…
          </>
        ) : (
          "SEND"
        )}
      </button>
    </form>
  );
}
