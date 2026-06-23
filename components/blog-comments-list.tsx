"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  users?: { display_name?: string; github_username?: string } | null;
}

/**
 * BlogCommentsList — client component (Issue #122)
 *
 * Fetches blog comments from Supabase with a join to `users` for display names.
 * Re-fetches when the blogId changes.
 */
export function BlogCommentsList({ blogId }: { blogId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("blog_comments")
      .select(`id, content, created_at, user_id, users(display_name, github_username)`)
      .eq("blog_id", blogId)
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        setComments((data as Comment[]) ?? []);
        setLoading(false);
      });
  }, [blogId]);

  if (loading) {
    return <p className="text-sm text-white/40">Loading comments…</p>;
  }

  if (comments.length === 0) {
    return <p className="text-sm text-white/40">No comments yet. Be the first!</p>;
  }

  return (
    <ul className="mt-4 space-y-4">
      {comments.map((comment) => {
        const displayName =
          comment.users?.display_name ||
          (comment.users?.github_username ? `@${comment.users.github_username}` : "Anonymous");

        return (
          <li
            key={comment.id}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-3"
          >
            <div className="mb-1.5 flex items-center justify-between gap-2">
              <span className="text-sm font-semibold text-white/90">{displayName}</span>
              <span className="text-xs text-white/40">
                {new Date(comment.created_at).toLocaleDateString("en-IN", {
                  dateStyle: "medium",
                })}
              </span>
            </div>
            <p className="text-sm leading-relaxed text-white/70">{comment.content}</p>
          </li>
        );
      })}
    </ul>
  );
}
