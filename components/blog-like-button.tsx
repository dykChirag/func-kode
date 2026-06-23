"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ANALYTICS_EVENTS, track } from "@/lib/analytics";

interface BlogLikeButtonProps {
  blogId: string;
  initialLikeCount: number;
  userId: string | null;
  blogSlug: string;
}

/**
 * BlogLikeButton — client component (Issue #122)
 *
 * Optimistic like/unlike with Supabase blog_likes table.
 * Logged-out → redirects to /auth/login?redirect=/blog/[slug].
 * BLOG_LIKED analytics event on both like and unlike.
 */
export function BlogLikeButton({
  blogId,
  initialLikeCount,
  userId,
  blogSlug,
}: BlogLikeButtonProps) {
  const router = useRouter();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [loading, setLoading] = useState(false);

  // Check if the current user has already liked this post
  useEffect(() => {
    if (!userId) return;
    const supabase = createClient();
    supabase
      .from("blog_likes")
      .select("id")
      .eq("blog_id", blogId)
      .eq("user_id", userId)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setLiked(true);
      });
  }, [blogId, userId]);

  const handleLike = async () => {
    if (!userId) {
      router.push(`/auth/login?redirect=/blog/${blogSlug}`);
      return;
    }

    setLoading(true);

    // Optimistic update
    const wasLiked = liked;
    setLiked(!wasLiked);
    setLikeCount((c) => (wasLiked ? c - 1 : c + 1));

    const supabase = createClient();

    if (wasLiked) {
      // Unlike: delete the row
      const { error } = await supabase
        .from("blog_likes")
        .delete()
        .eq("blog_id", blogId)
        .eq("user_id", userId);

      if (error) {
        // Revert optimistic update
        setLiked(wasLiked);
        setLikeCount((c) => c + 1);
      } else {
        track(ANALYTICS_EVENTS.BLOG_LIKED, { blog_id: blogId, action: "unlike" });
      }
    } else {
      // Like: insert a row
      const { error } = await supabase
        .from("blog_likes")
        .insert({ blog_id: blogId, user_id: userId });

      if (error) {
        // Revert optimistic update
        setLiked(wasLiked);
        setLikeCount((c) => c - 1);
      } else {
        track(ANALYTICS_EVENTS.BLOG_LIKED, { blog_id: blogId, action: "like" });
      }
    }

    setLoading(false);
  };

  return (
    <button
      type="button"
      onClick={handleLike}
      disabled={loading}
      aria-label={liked ? "Unlike this post" : "Like this post"}
      className={`flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold transition disabled:opacity-60 ${
        liked
          ? "border-[#00C9B7]/50 bg-[#00C9B7]/10 text-[#00C9B7]"
          : "border-white/15 bg-white/5 text-white/60 hover:border-white/30 hover:text-white/90"
      }`}
    >
      <span aria-hidden>{liked ? "♥" : "♡"}</span>
      {likeCount}
    </button>
  );
}
