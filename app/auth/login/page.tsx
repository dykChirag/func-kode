"use client";
import { createClient } from "@/lib/supabase/client";
import { LoginForm } from "@/components/login-form";
import Image from "next/image";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// Map OAuth error codes → human-readable messages
const ERROR_MESSAGES: Record<string, string> = {
  oauth_error: "OAuth authentication failed. Please try again.",
  no_code: "No authorisation code received from GitHub.",
  exchange_failed: "Failed to exchange authorisation code for session.",
  session_error: "Session creation failed.",
  no_session: "No session created after authentication.",
  callback_error: "Authentication callback error.",
  server_error: "Server error during authentication.",
};

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const errorParam = searchParams.get("error");
    const details = searchParams.get("details");

    if (errorParam) {
      let msg = ERROR_MESSAGES[errorParam] ?? "Authentication failed. Please try again.";
      if (details) msg += ` Details: ${decodeURIComponent(details)}`;
      setError(msg);
    }

    const checkAuth = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // Honour the `next` param so protected-route redirects land correctly.
        const next = searchParams.get("next") ?? "/dashboard";
        router.replace(next);
        return;
      }
      setChecking(false);
    };

    checkAuth();
  }, [router, searchParams]);

  // Single branded loader — no second layout swap
  if (checking) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(180deg,#6325B0 0%,#0D1527 78%)",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <Image
            src="/landing/logo.png"
            alt="func(kode)"
            width={56}
            height={56}
            style={{ borderRadius: 12, animation: "bounce 1s infinite" }}
          />
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14 }}>Checking your session…</p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(180deg,#6325B0 0%,#0D1527 78%)",
        padding: "24px 16px",
      }}
    >
      <div style={{ width: "100%", maxWidth: 440 }}>
        {/* Logo + heading */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Image
            src="/landing/logo.png"
            alt="func(kode)"
            width={72}
            height={72}
            style={{ borderRadius: 16, margin: "0 auto" }}
          />
          <h1
            style={{
              marginTop: 20,
              fontSize: 28,
              fontWeight: 700,
              color: "#fff",
              lineHeight: 1.2,
            }}
          >
            Get started with func(kode)
          </h1>
          <p style={{ marginTop: 8, fontSize: 14, color: "rgba(255,255,255,0.55)" }}>
            Join our community of developers building amazing projects together
          </p>
        </div>

        {/* Card */}
        <div
          style={{
            background: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 20,
            padding: "32px 28px",
          }}
        >
          {error && (
            <div
              style={{
                marginBottom: 20,
                padding: "12px 16px",
                background: "rgba(220,57,95,0.15)",
                border: "1px solid rgba(220,57,95,0.3)",
                borderRadius: 12,
              }}
            >
              <p style={{ fontSize: 13, color: "#ff6b8a", textAlign: "center" }}>{error}</p>
            </div>
          )}

          <LoginForm />

          <p
            style={{
              marginTop: 20,
              textAlign: "center",
              fontSize: 12,
              color: "rgba(255,255,255,0.35)",
            }}
          >
            By continuing, you agree to our terms and join our open-source community
          </p>
        </div>

        <p
          style={{
            marginTop: 20,
            textAlign: "center",
            fontSize: 13,
            color: "rgba(255,255,255,0.4)",
          }}
        >
          New to func(kode)? You&apos;ll be automatically onboarded after signing in
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  // Suspense only wraps the inner content (needed for useSearchParams).
  // The fallback matches the branded loader exactly so there is zero layout jump.
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(180deg,#6325B0 0%,#0D1527 78%)",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
            <Image
              src="/landing/logo.png"
              alt="func(kode)"
              width={56}
              height={56}
              style={{ borderRadius: 12, animation: "bounce 1s infinite" }}
            />
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14 }}>Loading…</p>
          </div>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
