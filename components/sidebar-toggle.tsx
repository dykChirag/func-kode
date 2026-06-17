"use client";

const IcMenu = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
  >
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

interface SidebarToggleProps {
  open: boolean;
  onToggle: () => void;
}

export function SidebarToggle({ open, onToggle }: SidebarToggleProps) {
  return (
    <button
      onClick={onToggle}
      aria-label="Toggle sidebar"
      suppressHydrationWarning
      style={{
        position: "absolute",
        top: 24,
        left: open ? 284 : 20,
        zIndex: 21,
        width: 32,
        height: 32,
        background: "rgba(255,255,255,0.08)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        border: "1px solid rgba(255,255,255,0.15)",
        borderRadius: 8,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        color: "white",
        transition: "left 0.25s ease",
      }}
    >
      <IcMenu />
    </button>
  );
}
