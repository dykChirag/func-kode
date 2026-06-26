"use client";
import React from "react";
import { Globe } from "lucide-react";

interface ActivePullRequestsProps {
  count?: number;
  trend?: string;
  onIconClick?: () => void;
}

export function ActivePullRequests({
  count = 5,
  trend = "+5%",
  onIconClick,
}: ActivePullRequestsProps) {
  return (
    <div
      className="dashboard-card"
      style={{
        position: "relative",
        flex: "1 1 342px",
        maxWidth: 382,
        height: 80,
        borderRadius: 20,
        padding: "17.5px 17.5px 17.5px 22px",
        boxSizing: "border-box",
        background: "linear-gradient(127deg, rgba(6, 11, 38, 0.74) 28.26%, rgba(26, 31, 55, 0.50) 91.2%)",
        backgroundClip: "padding-box",
        backdropFilter: "blur(60px)",
        WebkitBackdropFilter: "blur(60px)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span
          className="dashboard-card-title"
          style={{
            color: "var(--Gray-Gray-400, #A0AEC0)",
            fontFamily: "Poppins, sans-serif",
            fontSize: "12px",
            fontStyle: "normal",
            fontWeight: 500,
            lineHeight: "100%",
            height: "12px",
            width: 150,
            display: "block",
          }}
        >
          Active Pull Requests
        </span>
        <div style={{ display: "flex", alignItems: "baseline", gap: 15 }}>
          <span
            className="dashboard-card-value"
            style={{
              color: "#FFF",
              fontFamily: "Poppins, sans-serif",
              fontSize: "18px",
              fontStyle: "normal",
              fontWeight: 700,
              lineHeight: "140%",
            }}
          >
            {count}
          </span>
          <span
            className="dashboard-card-trend"
            style={{
              color: "#01B574", // Green trend color
              fontFamily: "Poppins, sans-serif",
              fontStyle: "normal",
              fontWeight: 700,
              lineHeight: "140%",
              display: "inline-block",
            }}
          >
            {trend}
          </span>
        </div>
      </div>

      {/* Globe Icon Button */}
      <button
        onClick={onIconClick}
        aria-label="View pull requests"
        className="active-prs-btn dashboard-card-btn"
        style={{
          position: "absolute",
          top: "17.5px",
          right: "17.5px",
          width: 45,
          height: 45,
          background: "#0075FF",
          border: "none",
          borderRadius: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          color: "#FFFFFF",
          boxShadow: "0px 3.5px 5.5px 0px rgba(0, 0, 0, 0.02)",
          transition: "transform 0.2s ease, background 0.2s ease",
          padding: 0,
          outline: "none",
        }}
      >
        <Globe size={20} />
      </button>

      <style jsx global>{`
        .active-prs-btn:hover {
          transform: scale(1.05);
          background: #0066de;
        }
        .active-prs-btn:active {
          transform: scale(0.95);
        }
      `}</style>
    </div>
  );
}
