import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

type CookieStore = {
  getAll: () => { name: string; value: string; options?: object }[];
  set: (name: string, value: string, options?: object) => void;
};

// Helper to get the correct redirect URL for OAuth
export function getOAuthRedirectPath(path: string = "/dashboard") {
  // Use NEXT_PUBLIC_SITE_URL if set, otherwise fallback to VERCEL_URL or localhost
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
  return `${baseUrl.replace(/\/$/, "")}${path}`;
}

/** Server Supabase client with awaited Next.js 15+ cookies. */
export async function createServerSupabaseClient() {
  const cookieStore = await cookies();
  return createClient({
    getAll: () => cookieStore.getAll(),
    set: (name, value, options) => cookieStore.set(name, value, options),
  });
}

export const createClient = (cookieStore: CookieStore) => {
  return createServerClient(
    supabaseUrl!,
    supabaseKey!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: object }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {
            // The `setAll` method was called from a Server Component.
          }
        },
      },
    },
  );
};
