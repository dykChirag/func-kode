"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

interface GetPatchIdScoreCardProps {
  onIconClick?: () => void;
}

export function GetPatchIdScoreCard({ onIconClick }: GetPatchIdScoreCardProps) {
  return (
    <div
      className={`${poppins.className} dashboard-card`}
      style={{
        position: "relative",
        flex: "1 1 342px",
        maxWidth: 382,
        height: 80,
        borderRadius: 20,
        padding: "17.5px 70px 17.5px 22px",
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
      <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
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
            width: "100%",
            display: "block",
          }}
        >
          Get Your Patch ID Score
        </span>
        <div style={{ display: "flex", alignItems: "baseline" }}>
          <Link
            href="#"
            className="dashboard-card-action"
            style={{
              color: "#FFF",
              fontFamily: "Poppins, sans-serif",
              fontSize: "12px",
              fontStyle: "normal",
              fontWeight: 500,
              lineHeight: "140%",
              textDecoration: "none",
              display: "inline",
            }}
          >
            Click Here to <span style={{ whiteSpace: "nowrap" }}>Generate
            <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "inline-block", marginLeft: 4, verticalAlign: "middle" }}>
              <path d="M1 4h6M4.5 1.5L7 4L4.5 6.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg></span>
          </Link>
        </div>
      </div>

      {/* Mascot Face Icon Button */}
      <button
        onClick={onIconClick}
        aria-label="Generate score"
        className="mascot-btn dashboard-card-btn"
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
          {/* Stylized White Raccoon Mascot SVG */}
          <Image src="/landing/logo.png" alt="Mascot" width={40} height={36} style={{ display: "block" }} unoptimized />
      </button>

      <style jsx global>{`
        .mascot-btn:hover {
          transform: scale(1.05);
          background: #0066de;
        }
        .mascot-btn:active {
          transform: scale(0.95);
        }
        .dashboard-card-title {
          white-space: nowrap;
        }
        @media (max-width: 767px) {
          .dashboard-card {
            max-width: 100% !important;
            padding: 12px 50px 12px 14px !important;
            border-radius: 16px !important;
          }
          .dashboard-card-title {
            font-size: 10px !important;
            width: 100% !important;
            white-space: normal !important;
            line-height: 120% !important;
            height: auto !important;
          }
          .dashboard-card-action {
            font-size: 10px !important;
          }
          .dashboard-card-btn {
            width: 32px !important;
            height: 32px !important;
            top: 24px !important;
            right: 10px !important;
            border-radius: 8px !important;
          }
          .dashboard-card-btn img {
            width: 18px !important;
            height: 16px !important;
          }
        }
      `}</style>
    </div>
  );
}
