"use client";
import React from "react";

interface DashboardFooterProps {
  isMobile?: boolean;
}

export function DashboardFooter({ isMobile = false }: DashboardFooterProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 8,
        padding: "14px 0 16px 0",
      }}
    >
      <span
        style={{
          color: "#A0AEC0",
          fontFamily: "Poppins, sans-serif",
          fontSize: isMobile ? 12 : 14,
          fontWeight: 400,
        }}
      >
        © 2026, BBuilds Product Studio
      </span>

      <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 16 : 32 }}>
        {[{ label: "Patch ID", href: "#" }, { label: "Blog", href: "/blog" }, { label: "License", href: "#" }].map(({ label, href }) => (
          <a
            key={label}
            href={href}
            style={{
              color: "#A0AEC0",
              fontFamily: "Poppins, sans-serif",
              fontSize: isMobile ? 12 : 14,
              fontWeight: 400,
              textDecoration: "none",
            }}
          >
            {label}
          </a>
        ))}
      </div>
    </div>
  );
}
