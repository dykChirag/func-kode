import Image from "next/image";
import { UpdatePasswordForm } from "@/components/update-password-form";

export default function UpdatePasswordPage() {
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
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <Image
            src="/landing/logo.png"
            alt="func(kode)"
            width={56}
            height={56}
            style={{ borderRadius: 12, margin: "0 auto 16px" }}
          />
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "#fff", marginBottom: 8 }}>
            Set a new password
          </h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)" }}>
            Choose a strong password for your account
          </p>
        </div>

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
          <UpdatePasswordForm />
        </div>
      </div>
    </div>
  );
}
