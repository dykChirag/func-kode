import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

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
  const response = NextResponse.next();

  if (!hasSupabaseAuthCookies(request)) {
    return response;
  }

  const supabase = createMiddlewareClient({ req: request, res: response });

  try {
    await supabase.auth.getSession();
  } catch {
    // Local Supabase down or stale session — drop cookies so refresh is not retried every request
    clearSupabaseAuthCookies(request, response);
  }

  return response;
}
