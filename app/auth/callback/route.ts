import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { ANALYTICS_EVENTS } from "@/lib/analytics/events";
import { captureServerEvent } from "@/lib/analytics/server";

function sanitizeNextPath(next: string | null): string {
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return "/dashboard";
  }
  return next;
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = sanitizeNextPath(url.searchParams.get("next"));

  if (!code) {
    await captureServerEvent("anonymous", ANALYTICS_EVENTS.LOGIN_FAILED, {
      error: "no_code",
    });
    return NextResponse.redirect(new URL("/auth/login?error=no_code", request.url));
  }

  // Initialize response BEFORE createServerClient so the setAll cookie
  // adapter can write Set-Cookie headers onto it correctly.
  const response = NextResponse.redirect(new URL(next, request.url));

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  if (error || !data.session) {
    await captureServerEvent("anonymous", ANALYTICS_EVENTS.LOGIN_FAILED, {
      error: error?.message ?? "exchange_failed",
    });
    return NextResponse.redirect(new URL("/auth/login?error=exchange_failed", request.url));
  }

  const userId = data.session.user.id;
  const provider =
    (data.session.user.app_metadata?.provider as string | undefined) ?? "github";

  await captureServerEvent(userId, ANALYTICS_EVENTS.LOGIN_SUCCEEDED, { provider });

  return response;
}
