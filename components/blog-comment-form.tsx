"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ANALYTICS_EVENTS, track } from "@/lib/analytics";

interface BlogCommentFormProps {
  blogId: string;
  userId: string | null;
  blogSlug: string;
}

/**
 * BlogCommentForm — client component (Issue #122)
 *
 * - Logged-out: shows "Login to comment" prompt
 * - Empty comment: validation prevents submit
 * - Supabase blog_comments insert with blog_id + user_id
 * - BLOG_COMMENTED analytics event
 * - Triggers a page refresh after successful comment to show new comment
 */
export function BlogCommentForm({ blogId, userId, blogSlug }: BlogCommentFormProps) {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [contentError, setContentError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!userId) {
    return (
      <div className="mb-6 rounded-xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-white/60">
        <a
          href={`/auth/login?redirect=/blog/${blogSlug}`}
          className="font-semibold text-white/90 underline underline-offset-2 hover:text-white"
        >
          Log in
        </a>{" "}
        to leave a comment.
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContentError("");
    setSubmitError("");

    if (!content.trim()) {
      setContentError("Comment cannot be empty.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.from("blog_comments").insert({
        blog_id: blogId,
        user_id: userId,
        content: content.trim(),
      });

      if (error) {
        setSubmitError(`Failed to post comment: ${error.message}`);
        return;
      }

      track(ANALYTICS_EVENTS.BLOG_COMMENTED, { blog_id: blogId });
      setContent("");
      // Refresh server component data to show new comment
      router.refresh();
    } catch (err) {
      setSubmitError(
        `Unexpected error: ${err instanceof Error ? err.message : "Please try again."}`,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="mb-6 space-y-3">
      <div>
        <textarea
          rows={3}
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            if (contentError) setContentError("");
          }}
          placeholder="Write a comment…"
          disabled={loading}
          className="w-full resize-none rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none transition focus:border-white/40 focus:ring-1 focus:ring-white/20 disabled:opacity-60"
        />
        {contentError && (
          <p className="mt-1 text-xs text-destructive" role="alert">
            {contentError}
          </p>
        )}
      </div>

      {submitError && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400" role="alert">
          {submitError}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-bold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <>
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-black/20 border-t-black" />
            Posting…
          </>
        ) : (
          "Post Comment"
        )}
      </button>
    </form>
  );
}
