import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";

/**
 * /blog — Blog listing page (Issue #122)
 *
 * Fetches published blog posts from Supabase `blogs` table.
 * Shows a real empty state if no posts exist.
 * No auth required to view the listing.
 */
export default async function BlogPage() {
  const supabase = await createServerSupabaseClient();

  const { data: posts, error } = await supabase
    .from("blogs")
    .select("id, title, slug, excerpt, author, created_at, cover_image_url")
    .eq("published", true)
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-[#040710] px-5 py-12 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Blog
        </h1>
        <p className="mb-8 text-sm text-white/60">
          Thoughts, tutorials, and updates from the func(kode) community.
        </p>

        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm text-red-400">
            Failed to load blog posts. Please try again later.
          </div>
        )}

        {!error && (!posts || posts.length === 0) && (
          <div className="rounded-xl border border-white/10 bg-white/5 px-6 py-12 text-center">
            <p className="text-lg font-semibold text-white/80">No posts yet</p>
            <p className="mt-2 text-sm text-white/40">
              Check back soon — community blog posts will appear here.
            </p>
          </div>
        )}

        {posts && posts.length > 0 && (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <li key={post.id}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex h-full flex-col rounded-xl border border-white/10 bg-white/5 overflow-hidden transition hover:border-white/25 hover:bg-white/10"
                >
                  {post.cover_image_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={post.cover_image_url}
                      alt={post.title}
                      className="h-40 w-full object-cover"
                    />
                  )}
                  <div className="flex flex-1 flex-col p-5">
                    <h2 className="mb-1.5 text-base font-bold text-white group-hover:text-white/90">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="mb-3 line-clamp-2 text-sm text-white/50">{post.excerpt}</p>
                    )}
                    <div className="mt-auto flex items-center justify-between text-xs text-white/40">
                      {post.author && <span>{post.author}</span>}
                      {post.created_at && (
                        <span>
                          {new Date(post.created_at).toLocaleDateString("en-IN", {
                            dateStyle: "medium",
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
