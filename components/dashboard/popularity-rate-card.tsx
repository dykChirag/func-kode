"use client";
import React from "react";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const SmileyIcon = () => (
  <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_260_557)">
      <path d="M15.0124 2.5C8.1124 2.5 2.5249 8.1 2.5249 15C2.5249 21.9 8.1124 27.5 15.0124 27.5C21.9249 27.5 27.5249 21.9 27.5249 15C27.5249 8.1 21.9249 2.5 15.0124 2.5ZM15.0249 25C9.4999 25 5.0249 20.525 5.0249 15C5.0249 9.475 9.4999 5 15.0249 5C20.5499 5 25.0249 9.475 25.0249 15C25.0249 20.525 20.5499 25 15.0249 25ZM19.3999 13.75C20.4374 13.75 21.2749 12.9125 21.2749 11.875C21.2749 10.8375 20.4374 10 19.3999 10C18.3624 10 17.5249 10.8375 17.5249 11.875C17.5249 12.9125 18.3624 13.75 19.3999 13.75ZM10.6499 13.75C11.6874 13.75 12.5249 12.9125 12.5249 11.875C12.5249 10.8375 11.6874 10 10.6499 10C9.6124 10 8.7749 10.8375 8.7749 11.875C8.7749 12.9125 9.6124 13.75 10.6499 13.75ZM15.0249 21.875C17.5624 21.875 19.7749 20.4875 20.9624 18.4375C21.1999 18.025 20.8999 17.5 20.4124 17.5H9.6374C9.1624 17.5 8.8499 18.025 9.0874 18.4375C10.2749 20.4875 12.4874 21.875 15.0249 21.875Z" fill="white"/>
    </g>
    <defs>
      <clipPath id="clip0_260_557">
        <rect width="30" height="30" fill="white"/>
      </clipPath>
    </defs>
  </svg>
);

const RightCurve = () => (
  <svg width="23" height="102" viewBox="0 0 23 102" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3.19574 100.551C6.2048 102.288 10.0707 101.265 11.6264 98.1579C18.9912 83.4505 22.8454 67.2025 22.8454 50.6966C22.8454 34.1907 18.9912 17.9428 11.6264 3.23536C10.0707 0.12855 6.2048 -0.895018 3.19575 0.84227C0.186678 2.57955 -0.823568 6.41901 0.707285 9.53815C6.98188 22.3227 10.2629 36.3999 10.2629 50.6966C10.2629 64.9934 6.98187 79.0706 0.707291 91.8551C-0.823569 94.9743 0.186684 98.8137 3.19574 100.551Z" fill="#22234B"/>
  </svg>
);

const ArcTrack = () => (
  <svg width="212" height="212" viewBox="0 0 203 202" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M198.241 68.1396C201.455 66.8202 203.009 63.1352 201.501 60.0048C194.87 46.2368 185.328 34.0416 173.509 24.2776C160.069 13.1757 144.1 5.55956 127.014 2.10382C109.928 -1.35192 92.2535 -0.540591 75.5561 4.46592C58.8587 9.47243 43.6537 18.5196 31.288 30.806C18.9223 43.0925 9.7775 58.239 4.6637 74.9038C-0.450108 91.5686 -1.3751 109.237 1.97069 126.345C5.31647 143.453 12.8297 159.471 23.8449 172.982C33.5327 184.864 45.6663 194.484 59.3914 201.203C62.512 202.731 66.207 201.201 67.5469 197.996C68.8869 194.79 67.3628 191.124 64.2545 189.571C52.4334 183.666 41.977 175.309 33.597 165.031C23.8893 153.124 17.2679 139.007 14.3193 123.93C11.3706 108.853 12.1858 93.2817 16.6926 78.595C21.1994 63.9083 29.2587 50.5598 40.1565 39.7318C51.0544 28.9038 64.4545 20.9306 79.1698 16.5183C93.8852 12.1061 109.462 11.3911 124.519 14.4366C139.577 17.4821 153.651 24.1942 165.495 33.9783C175.719 42.4242 184.009 52.9342 189.838 64.793C191.371 67.9113 195.027 69.4589 198.241 68.1396Z" fill="url(#paint0_linear_260_548)"/>
    <defs>
      <linearGradient id="paint0_linear_260_548" x1="86.5007" y1="12.5" x2="3.50072" y2="120.5" gradientUnits="userSpaceOnUse">
        <stop stopColor="#0075FF"/>
        <stop offset="1" stopColor="#0075FF" stopOpacity="0"/>
      </linearGradient>
    </defs>
  </svg>
);

interface PopularityRateCardProps {
  percentage?: number;
  starsForksDesc?: string;
  isMobile?: boolean;
}

export function PopularityRateCard({
  percentage = 95,
  starsForksDesc = "Based on stars and forks",
  isMobile = false,
}: PopularityRateCardProps) {
  return (
    <div
      className={poppins.className}
      style={{
        position: "relative",
        width: isMobile ? "100%" : 350,
        height: 344,
        borderRadius: 20,
        boxSizing: "border-box",
        background: "linear-gradient(127deg, rgba(6, 11, 40, 0.94) 19.41%, rgba(10, 14, 35, 0.49) 76.65%)",
        backgroundClip: "padding-box",
        backdropFilter: "blur(60px)",
        WebkitBackdropFilter: "blur(60px)",
        overflow: "hidden",
      }}
    >
      {/* Title */}
      <div style={{ position: "absolute", top: 22, left: 30.2, display: "flex", flexDirection: "column", gap: 4 }}>
        <h3 style={{ color: "#FFF", fontFamily: "Poppins, sans-serif", fontSize: 18, fontWeight: 700, margin: 0, lineHeight: "140%" }}>
          Popularity Rate
        </h3>
        <span style={{ color: "var(--Gray-Gray-400, #A0AEC0)", fontFamily: "Poppins, sans-serif", fontSize: 14, fontWeight: 500, lineHeight: "100%" }}>
          From all your projects
        </span>
      </div>

      {/* Arc centered horizontally */}
      <div style={{
        position: "absolute",
        top: 85,
        left: "50%",
        transform: "translateX(-50%)",
      }}>
        {/* Right-side track curve — behind the arc */}
        <div style={{ position: "absolute", top: 52, right: -6, zIndex: 0 }}>
          <RightCurve />
        </div>
        <div style={{ position: "relative", zIndex: 1 }}>
          <ArcTrack />
        </div>
        {/* Smiley with blue circle bg */}
        <div style={{
          position: "absolute",
          top: 60,
          left: "50%",
          transform: "translateX(calc(-50% + 1px))",
          width: 48,
          height: 48,
          borderRadius: "50%",
          background: "#0075FF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0px 4px 15px rgba(0, 117, 255, 0.4)",
        }}>
          <SmileyIcon />
        </div>
      </div>

      {/* Bottom content box: left 29, right 28, bottom 38, H 82 */}
      <div style={{
        position: "absolute",
        bottom: 38,
        left: 29,
        right: 28,
        height: 82,
        borderRadius: 20,
        background: "linear-gradient(127deg, rgba(6, 11, 40, 0.74) 28.26%, rgba(10, 14, 35, 0.71) 91.2%)",
        backdropFilter: "blur(60px)",
        WebkitBackdropFilter: "blur(60px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: 4,
        paddingTop: 17,
        paddingLeft: 25,
        paddingRight: 21,
        boxSizing: "border-box",
      }}>
        {/* Row: 0% | 95% | 100% */}
        <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 12, fontWeight: 400, color: "var(--Gray-Gray-400, #A0AEC0)", lineHeight: "100%" }}>
            0%
          </span>
          <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 28, fontWeight: 700, color: "#FFF", lineHeight: "100%" }}>
            {Math.max(0, Math.min(100, percentage))}%
          </span>
          <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 12, fontWeight: 400, color: "var(--Gray-Gray-400, #A0AEC0)", lineHeight: "100%" }}>
            100%
          </span>
        </div>

        {/* Description */}
        <span style={{
          fontFamily: "Poppins, sans-serif",
          fontSize: 12,
          fontWeight: 400,
          color: "var(--Gray-Gray-400, #A0AEC0)",
          lineHeight: "100%",
          textAlign: "center",
        }}>
          {starsForksDesc}
        </span>
      </div>
    </div>
  );
}
