import { notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { BlogLikeButton } from "@/components/blog-like-button";
import { BlogCommentForm } from "@/components/blog-comment-form";
import { BlogCommentsList } from "@/components/blog-comments-list";

/**
 * /blog/[slug] — Blog detail page (Issue #122)
 *
 * Fetches by slug. notFound() on invalid slug (no crash, no blank screen).
 * Passes userId (or null) to client interaction components.
 */
export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createServerSupabaseClient();

  const { data: post, error } = await supabase
    .from("blogs")
    .select("id, title, slug, content, excerpt, author, created_at, cover_image_url")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error || !post) {
    notFound();
  }

  // Get current user (optional — not a guard, just for passing userId to client components)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Like count
  const { count: likeCount } = await supabase
    .from("blog_likes")
    .select("*", { count: "exact", head: true })
    .eq("blog_id", post.id);

  // Comment count
  const { count: commentCount } = await supabase
    .from("blog_comments")
    .select("*", { count: "exact", head: true })
    .eq("blog_id", post.id);

  return (
    <main className="min-h-screen bg-[#040710] px-5 py-12 sm:px-8">
      <article className="mx-auto max-w-2xl">
        {/* Cover image */}
        {post.cover_image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.cover_image_url}
            alt={post.title}
            className="mb-8 w-full rounded-xl object-cover max-h-64"
          />
        )}

        {/* Title */}
        <h1 className="mb-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
          {post.title}
        </h1>

        {/* Meta */}
        <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-white/50">
          {post.author && <span>By {post.author}</span>}
          {post.created_at && (
            <span>
              {new Date(post.created_at).toLocaleDateString("en-IN", { dateStyle: "long" })}
            </span>
          )}
          <span>{likeCount ?? 0} likes</span>
          <span>{commentCount ?? 0} comments</span>
        </div>

        {/* Content */}
        <div className="prose prose-invert max-w-none text-white/80">
          {post.content
            ? post.content.split("\n").map((para: string, i: number) =>
                para.trim() ? (
                  <p key={i} className="mb-4 text-base leading-relaxed">
                    {para}
                  </p>
                ) : null,
              )
            : post.excerpt && (
                <p className="text-base leading-relaxed">{post.excerpt}</p>
              )}
        </div>

        {/* Like button */}
        <div className="mt-8 flex items-center gap-3">
          <BlogLikeButton
            blogId={post.id}
            initialLikeCount={likeCount ?? 0}
            userId={user?.id ?? null}
            blogSlug={post.slug}
          />
        </div>

        {/* Comments section */}
        <section className="mt-10">
          <h2 className="mb-4 text-lg font-bold text-white">Comments</h2>
          <BlogCommentForm
            blogId={post.id}
            userId={user?.id ?? null}
            blogSlug={post.slug}
          />
          <BlogCommentsList blogId={post.id} />
        </section>
      </article>
    </main>
  );
}
