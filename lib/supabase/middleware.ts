import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { AuthSessionMissingError } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { emitPosthogLog } from "@/lib/posthog-server-logger";

const AUTH_EXCHANGE_PATHS = ["/auth/callback", "/auth/confirm"];

/** Routes that require an authenticated session. */
const PROTECTED_PATHS = ["/dashboard", "/explore", "/projects", "/docs", "/events", "/discussions", "/leaderboard", "/notifications", "/activity-logs", "/settings"];

/** Routes that logged-in users should not be able to revisit. */
const AUTH_ONLY_PATHS = ["/auth/login", "/auth/sign-up"];

function isAuthExchangePath(pathname: string): boolean {
  return AUTH_EXCHANGE_PATHS.some((path) => pathname.startsWith(path));
}

function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PATHS.some((path) => pathname.startsWith(path));
}

function isAuthOnlyPath(pathname: string): boolean {
  return AUTH_ONLY_PATHS.some((path) => pathname.startsWith(path));
}

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
  const { pathname } = request.nextUrl;

  // Always let the auth exchange routes through without any session logic.
  if (isAuthExchangePath(pathname)) {
    return NextResponse.next({ request });
  }

  // If there are no auth cookies at all we can skip the Supabase round-trip.
  if (!hasSupabaseAuthCookies(request)) {
    // But still enforce the route guard: unauthenticated users cannot visit
    // protected routes — redirect them to login, preserving the destination.
    if (isProtectedPath(pathname)) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/auth/login";
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
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

  let isAuthenticated = false;

  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    isAuthenticated = !!data.user;
  } catch (error) {
    if (error instanceof AuthSessionMissingError) {
      // Stale cookies before OAuth callback — not a real error.
    } else {
      console.warn("[middleware] Supabase session refresh failed, clearing auth cookies", error);
      emitPosthogLog({
        body: "Supabase session refresh failed in middleware",
        attributes: { pathname },
      });
      clearSupabaseAuthCookies(request, supabaseResponse);
    }
  }

  // Authenticated users trying to visit login/sign-up → send them to dashboard.
  if (isAuthenticated && isAuthOnlyPath(pathname)) {
    const dest = request.nextUrl.clone();
    dest.pathname = "/dashboard";
    return NextResponse.redirect(dest);
  }

  // Unauthenticated users trying to visit a protected route → login.
  if (!isAuthenticated && isProtectedPath(pathname)) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/auth/login";
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return supabaseResponse;
}
