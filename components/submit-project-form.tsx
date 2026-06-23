"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ANALYTICS_EVENTS, track } from "@/lib/analytics";

interface FormValues {
  project_name: string;
  description: string;
  github_url: string;
  tech_stack: string;
  looking_for: string;
}

interface FormErrors {
  project_name?: string;
  description?: string;
  github_url?: string;
}

const GITHUB_URL_RE = /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+(\/.*)?$/i;

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};

  if (!values.project_name.trim()) {
    errors.project_name = "Project name is required.";
  }

  if (!values.description.trim()) {
    errors.description = "Description is required.";
  }

  if (!values.github_url.trim()) {
    errors.github_url = "GitHub URL is required.";
  } else if (!GITHUB_URL_RE.test(values.github_url.trim())) {
    errors.github_url = "Enter a valid GitHub repository URL (e.g. https://github.com/org/repo).";
  }

  return errors;
}

/**
 * SubmitProjectForm
 *
 * Client component handling the full project submit journey (Issue #120):
 *   - Inline field-level validation with text-destructive error messages
 *   - GitHub URL format validation
 *   - Loading state (button disabled + spinner label)
 *   - Supabase `projects` insert with user_id
 *   - Error path: preserves form state, shows error message (no blank screen)
 *   - Success state: confirmation message + redirect to /dashboard
 *   - Mobile responsive: full-width inputs
 */
export function SubmitProjectForm({ userId }: { userId: string }) {
  const router = useRouter();

  const [values, setValues] = useState<FormValues>({
    project_name: "",
    description: "",
    github_url: "",
    tech_stack: "",
    looking_for: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    // Clear per-field error on change
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const validationErrors = validate(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    track(ANALYTICS_EVENTS.PROJECT_SUBMIT_STARTED, {
      has_tech_stack: Boolean(values.tech_stack.trim()),
    });

    try {
      const supabase = createClient();
      const { error } = await supabase.from("projects").insert({
        user_id: userId,
        project_name: values.project_name.trim(),
        description: values.description.trim(),
        github_url: values.github_url.trim(),
        tech_stack: values.tech_stack.trim() || null,
        looking_for: values.looking_for.trim() || null,
      });

      if (error) {
        // Preserve form state — user should not lose their input
        setSubmitError(
          error.code === "23505"
            ? "A project with this GitHub URL already exists."
            : `Failed to submit project: ${error.message}`,
        );
        track(ANALYTICS_EVENTS.PROJECT_SUBMITTED, { success: false, error: error.message });
        return;
      }

      track(ANALYTICS_EVENTS.PROJECT_SUBMITTED, { success: true });
      setSuccess(true);

      // Brief success display then redirect to dashboard
      setTimeout(() => router.push("/dashboard"), 1800);
    } catch (err) {
      setSubmitError(
        `Unexpected error: ${err instanceof Error ? err.message : "Please try again."}`
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="rounded-xl border border-green-500/30 bg-green-500/10 px-6 py-8 text-center">
        <p className="text-lg font-bold text-green-400">🎉 Project submitted successfully!</p>
        <p className="mt-2 text-sm text-white/60">Redirecting you to the dashboard…</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-6 rounded-xl border border-white/10 bg-white/5 p-6 sm:p-8"
    >
      {/* Project Name */}
      <div>
        <label
          htmlFor="project_name"
          className="mb-1.5 block text-sm font-semibold text-white"
        >
          Project Name <span className="text-red-400">*</span>
        </label>
        <input
          id="project_name"
          name="project_name"
          type="text"
          value={values.project_name}
          onChange={handleChange}
          placeholder="My Awesome Project"
          disabled={loading}
          className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none transition focus:border-white/40 focus:ring-1 focus:ring-white/20 disabled:opacity-60"
        />
        {errors.project_name && (
          <p className="mt-1 text-xs text-destructive" role="alert">
            {errors.project_name}
          </p>
        )}
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="description"
          className="mb-1.5 block text-sm font-semibold text-white"
        >
          Description <span className="text-red-400">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          value={values.description}
          onChange={handleChange}
          placeholder="What does this project do? Who is it for?"
          disabled={loading}
          className="w-full resize-none rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none transition focus:border-white/40 focus:ring-1 focus:ring-white/20 disabled:opacity-60"
        />
        {errors.description && (
          <p className="mt-1 text-xs text-destructive" role="alert">
            {errors.description}
          </p>
        )}
      </div>

      {/* GitHub URL */}
      <div>
        <label
          htmlFor="github_url"
          className="mb-1.5 block text-sm font-semibold text-white"
        >
          GitHub Repository URL <span className="text-red-400">*</span>
        </label>
        <input
          id="github_url"
          name="github_url"
          type="url"
          value={values.github_url}
          onChange={handleChange}
          placeholder="https://github.com/org/repo"
          disabled={loading}
          className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none transition focus:border-white/40 focus:ring-1 focus:ring-white/20 disabled:opacity-60"
        />
        {errors.github_url && (
          <p className="mt-1 text-xs text-destructive" role="alert">
            {errors.github_url}
          </p>
        )}
      </div>

      {/* Tech Stack (optional) */}
      <div>
        <label
          htmlFor="tech_stack"
          className="mb-1.5 block text-sm font-semibold text-white"
        >
          Tech Stack
          <span className="ml-1 text-xs font-normal text-white/40">(optional)</span>
        </label>
        <input
          id="tech_stack"
          name="tech_stack"
          type="text"
          value={values.tech_stack}
          onChange={handleChange}
          placeholder="e.g. Next.js, Supabase, TypeScript"
          disabled={loading}
          className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none transition focus:border-white/40 focus:ring-1 focus:ring-white/20 disabled:opacity-60"
        />
      </div>

      {/* Looking For (optional) */}
      <div>
        <label
          htmlFor="looking_for"
          className="mb-1.5 block text-sm font-semibold text-white"
        >
          Looking For
          <span className="ml-1 text-xs font-normal text-white/40">(optional)</span>
        </label>
        <input
          id="looking_for"
          name="looking_for"
          type="text"
          value={values.looking_for}
          onChange={handleChange}
          placeholder="e.g. Frontend devs, designers, documentation help"
          disabled={loading}
          className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none transition focus:border-white/40 focus:ring-1 focus:ring-white/20 disabled:opacity-60"
        />
      </div>

      {/* Submit error (network/server) */}
      {submitError && (
        <div
          className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400"
          role="alert"
        >
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
            Submitting…
          </>
        ) : (
          "Submit Project"
        )}
      </button>
    </form>
  );
}
