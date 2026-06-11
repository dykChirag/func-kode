import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { emitPosthogLog } from "@/lib/posthog-server-logger";

function hasSupabaseAuthCookies(request: NextRequest): boolean {
  return request.cookies.getAll().some((cookie) => cookie.name.includes("auth-token"));
}

function clearSupabaseAuthCookies(request: NextRequest, response: NextResponse): void {
  for (const cookie of request.cookies.getAll()) {
    if (cookie.name.includes("sb-") && cookie.name.includes("auth")) {
      response.cookies.delete(cookie.name);
    }
  }
}

export async function updateSession(request: NextRequest) {
  if (!hasSupabaseAuthCookies(request)) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  try {
    const { error } = await supabase.auth.getUser();
    if (error) {
      throw error;
    }
  } catch (error) {
    console.warn("[middleware] Supabase session refresh failed, clearing auth cookies", error);
    emitPosthogLog({
      body: "Supabase session refresh failed in middleware",
      attributes: {
        pathname: request.nextUrl.pathname,
      },
    });
    clearSupabaseAuthCookies(request, supabaseResponse);
  }

  return supabaseResponse;
}
