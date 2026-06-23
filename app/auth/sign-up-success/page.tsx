import Image from "next/image";
import Link from "next/link";

export default function SignUpSuccessPage() {
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

        {/* Success icon */}
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: "rgba(0,201,183,0.2)",
            border: "1px solid rgba(0,201,183,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
            fontSize: 26,
          }}
        >
          ✉️
        </div>

        <h1
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: "#fff",
            marginBottom: 12,
          }}
        >
          Check your email
        </h1>

        <p
          style={{
            fontSize: 14,
            color: "rgba(255,255,255,0.6)",
            marginBottom: 8,
            lineHeight: 1.6,
          }}
        >
          We&apos;ve sent a confirmation link to your inbox. Click it to activate your account and
          get started.
        </p>

        <p
          style={{
            fontSize: 13,
            color: "rgba(255,255,255,0.35)",
            marginBottom: 32,
          }}
        >
          Didn&apos;t receive it? Check your spam folder.
        </p>

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
