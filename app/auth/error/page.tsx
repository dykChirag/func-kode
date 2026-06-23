import Image from "next/image";
import Link from "next/link";

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

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
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 20,
          padding: "40px 32px",
          textAlign: "center",
        }}
      >
        <Image
          src="/landing/logo.png"
          alt="func(kode)"
          width={56}
          height={56}
          style={{ borderRadius: 12, margin: "0 auto 20px" }}
        />

        {/* Error icon */}
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: "rgba(220,57,95,0.2)",
            border: "1px solid rgba(220,57,95,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
            fontSize: 26,
          }}
        >
          ⚠️
        </div>

        <h1
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: "#fff",
            marginBottom: 12,
          }}
        >
          Something went wrong
        </h1>

        {error ? (
          <p
            style={{
              fontSize: 13,
              color: "rgba(255,255,255,0.55)",
              marginBottom: 28,
              wordBreak: "break-word",
            }}
          >
            {decodeURIComponent(error)}
          </p>
        ) : (
          <p
            style={{
              fontSize: 13,
              color: "rgba(255,255,255,0.55)",
              marginBottom: 28,
            }}
          >
            An unexpected error occurred during authentication.
          </p>
        )}

        <Link
          href="/auth/login"
          style={{
            display: "inline-block",
            padding: "12px 32px",
            background: "linear-gradient(135deg,#6325B0,#0075FF)",
            color: "#fff",
            borderRadius: 12,
            fontSize: 14,
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          Back to Sign In
        </Link>
      </div>
    </div>
  );
}
