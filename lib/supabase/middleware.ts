import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { emitPosthogLog } from "@/lib/posthog-server-logger";

function hasSupabaseAuthCookies(request: NextRequest): boolean {
  // Supabase auth cookies follow the pattern: sb-<project-ref>-auth-token
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
  const response = NextResponse.next();

  if (!hasSupabaseAuthCookies(request)) {
    return response;
  }

  const supabase = createMiddlewareClient({ req: request, res: response });

  try {
    await supabase.auth.getSession();
  } catch (error) {
    console.warn("[middleware] Supabase session refresh failed, clearing auth cookies", error);
    emitPosthogLog({
      body: "Supabase session refresh failed in middleware",
      attributes: {
        pathname: request.nextUrl.pathname,
      },
    });
    clearSupabaseAuthCookies(request, response);
  }

  return response;
}
