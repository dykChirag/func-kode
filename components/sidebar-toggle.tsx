"use client";
import Image from "next/image";

interface SidebarToggleProps {
  open: boolean;
  onToggle: () => void;
  scale?: number; // kept for API compatibility, unused
}

export function SidebarToggle({ open, onToggle }: SidebarToggleProps) {
  return (
    <>
      {/* Raccoon toggle — always fixed top-left, always the same icon */}
      <button
        onClick={onToggle}
        aria-label={open ? "Close sidebar" : "Open sidebar"}
        suppressHydrationWarning
        style={{
          position: "fixed",
          top: 16,
          left: 16,
          zIndex: 10001,
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
          transition: "background 0.2s ease, border-color 0.2s ease",
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

      {/* Mobile backdrop — tap outside to close */}
      {open && (
        <div
          aria-hidden="true"
          className="sidebar-mobile-backdrop"
          onClick={onToggle}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9998,
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(2px)",
            WebkitBackdropFilter: "blur(2px)",
          }}
        />
      )}

      <style>{`
        @media (min-width: 768px) {
          .sidebar-mobile-backdrop { display: none !important; }
        }
      `}</style>
    </>
  );
}
