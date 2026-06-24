"use client";
import Image from "next/image";

interface SidebarToggleProps {
  open: boolean;
  onToggle: () => void;
}

export function SidebarToggle({ open, onToggle }: SidebarToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label="Open sidebar"
      aria-hidden={open}
      tabIndex={open ? -1 : 0}
      suppressHydrationWarning
      style={{
        position: "absolute",
        top: 42,
        left: 28,
        zIndex: 25,
        width: 44,
        height: 44,
        background: "rgba(255,255,255,0.08)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.15)",
        borderRadius: 12,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        padding: 0,
        opacity: open ? 0 : 1,
        pointerEvents: open ? "none" : "auto",
        transition: "opacity 0.2s ease, background 0.2s ease, border-color 0.2s ease",
      }}
    >
      <Image
        src="/landing/logo.png"
        alt="func(kode)"
        width={28}
        height={25}
        style={{ borderRadius: 4, display: "block" }}
        priority
      />
    </button>
  );
}
