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

const IcClose = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
  >
    <line x1="4" y1="4" x2="20" y2="20" />
    <line x1="20" y1="4" x2="4" y2="20" />
  </svg>
);

interface SidebarToggleProps {
  open: boolean;
  onToggle: () => void;
  scale?: number;
}

export function SidebarToggle({ open, onToggle, scale = 1 }: SidebarToggleProps) {
  return (
    <>
      {/* ── Desktop toggle (unchanged behaviour) ── */}
      <button
        onClick={onToggle}
        aria-label={open ? "Close sidebar" : "Open sidebar"}
        suppressHydrationWarning
        className="sidebar-toggle-desktop"
        style={{
          position: "fixed",
          top: 24 * scale,
          left: open ? 284 * scale : 20,
          zIndex: 9999,
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
          transition: "left 0.25s ease, top 0.25s ease",
        }}
      >
        {open ? <IcClose /> : <IcMenu />}
      </button>

      {/* ── Mobile hamburger — fixed top-left, always visible ── */}
      <button
        onClick={onToggle}
        aria-label={open ? "Close menu" : "Open menu"}
        className="sidebar-toggle-mobile"
        style={{
          position: "fixed",
          top: 16,
          left: 16,
          zIndex: 10000,
          width: 40,
          height: 40,
          background: "rgba(255,255,255,0.1)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.18)",
          borderRadius: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          color: "white",
        }}
      >
        {open ? <IcClose /> : <IcMenu />}
      </button>

      {/* ── Mobile backdrop — tapping outside closes drawer ── */}
      {open && (
        <div
          aria-hidden="true"
          className="sidebar-mobile-backdrop"
          onClick={onToggle}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9998,
            background: "rgba(0,0,0,0.45)",
            backdropFilter: "blur(2px)",
            WebkitBackdropFilter: "blur(2px)",
          }}
        />
      )}

      {/* ── Responsive CSS ── */}
      <style>{`
        /* Desktop: show desktop toggle, hide mobile toggle & backdrop */
        @media (min-width: 768px) {
          .sidebar-toggle-desktop { display: flex !important; }
          .sidebar-toggle-mobile  { display: none  !important; }
          .sidebar-mobile-backdrop { display: none !important; }
        }
        /* Mobile: hide desktop toggle, show mobile toggle */
        @media (max-width: 767px) {
          .sidebar-toggle-desktop { display: none  !important; }
          .sidebar-toggle-mobile  { display: flex  !important; }
        }
      `}</style>
    </>
  );
}
