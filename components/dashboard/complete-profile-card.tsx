"use client";
import React, { useState, useRef, useEffect } from "react";

interface CompleteProfileCardProps {
  onboardingPercentage?: number;
  sufficiencyText?: string;
  insufficiencyText?: string;
  isMobile?: boolean;
}

export function CompleteProfileCard({
  onboardingPercentage = 75,
  sufficiencyText = "Code Quality",
  insufficiencyText = "Consistency",
  isMobile = false,
}: CompleteProfileCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  return (
    <div
      className="dashboard-card"
      style={{
        position: "relative",
        width: "100%",
        height: isMobile ? "auto" : 344,
        borderRadius: 20,
        padding: isMobile ? "20px 16px 20px 16px" : "27px 22px 24px 31px",
        boxSizing: "border-box",
        background: "linear-gradient(127deg, rgba(6, 11, 40, 0.74) 28.26%, rgba(14, 21, 58, 0.71) 91.2%)",
        backgroundClip: "padding-box",
        backdropFilter: "blur(60px)",
        WebkitBackdropFilter: "blur(60px)",
        border: "1.5px solid rgba(255, 255, 255, 0.1)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
      }}
    >
      {/* Top Title & Menu Button */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          width: "100%",
        }}
      >
        <h3
          style={{
            color: "#FFF",
            fontSize: "18px",
            fontWeight: 700,
            margin: 0,
            lineHeight: "140%",
            maxWidth: 347,
          }}
        >
          Complete Profile to Generate Patch ID
        </h3>
        
        {/* Three Dots Action Button + Dropdown */}
        <div ref={menuRef} style={isMobile ? { position: "absolute", top: 20, right: 16 } : { position: "relative", flexShrink: 0 }}>
          <button
            aria-label="More profile actions"
            onClick={() => setMenuOpen((v) => !v)}
            style={{
              width: 37,
              height: 37,
              borderRadius: 12,
              background: menuOpen ? "rgba(255, 255, 255, 0.15)" : "rgba(255, 255, 255, 0.08)",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "background 0.2s ease",
              padding: 0,
              outline: "none",
            }}
            className="profile-dots-btn"
          >
            <svg width="16" height="4" viewBox="0 0 16 4" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 0C0.9 0 0 0.9 0 2C0 3.1 0.9 4 2 4C3.1 4 4 3.1 4 2C4 0.9 3.1 0 2 0ZM14 0C12.9 0 12 0.9 12 2C12 3.1 12.9 4 14 4C15.1 4 16 3.1 16 2C16 0.9 15.1 0 14 0ZM8 0C6.9 0 6 0.9 6 2C6 3.1 6.9 4 8 4C9.1 4 10 3.1 10 2C10 0.9 9.1 0 8 0Z" fill="#7551FF"/>
            </svg>
          </button>

          {menuOpen && (
            <div
              style={{
                position: "absolute",
                top: 44,
                right: 0,
                zIndex: 100,
                background: "linear-gradient(127deg, rgba(6,11,40,0.97) 28.26%, rgba(10,14,35,0.97) 91.2%)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1.5px solid rgba(255,255,255,0.12)",
                borderRadius: 12,
                padding: "6px",
                minWidth: 130,
                boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
              }}
            >
              <button
                onClick={() => setMenuOpen(false)}
                style={{
                  width: "100%",
                  background: "none",
                  border: "none",
                  color: "#FFF",
                  fontFamily: "Poppins, sans-serif",
                  fontSize: 13,
                  fontWeight: 500,
                  padding: "8px 14px",
                  textAlign: "left",
                  cursor: "pointer",
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
                className="profile-menu-item"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" fill="#A0AEC0"/>
                </svg>
                Refresh
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area: Columns */}
      <div
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          margin: isMobile ? "16px 0 0 12px" : "29px 0 0 0",
          gap: isMobile ? 16 : 0,
          alignItems: isMobile ? "stretch" : undefined,
        }}
      >
        {/* Left: Sufficiency Stack */}
        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "row" : "column",
            gap: isMobile ? 8 : 16,
          }}
        >
          {/* Data Sufficiency */}
          <div
            style={{
              display: "inline-flex",
              flexDirection: "column",
              flex: isMobile ? 1 : undefined,
              alignSelf: "flex-start",
              width: isMobile ? undefined : 217,
              boxSizing: "border-box",
              gap: 6,
              padding: isMobile ? "12px 10px 12px 10px" : "20px 72px 29px 24px",
              borderRadius: 20,
              background: "linear-gradient(127deg, #060C29 28.26%, rgba(4, 12, 48, 0.50) 91.2%)",
              backdropFilter: "blur(60px)",
              WebkitBackdropFilter: "blur(60px)",
            }}
          >
            <span style={{ color: "#A0AEC0", fontSize: isMobile ? "10px" : "12px", fontWeight: 500, lineHeight: "100%", whiteSpace: isMobile ? "nowrap" : undefined }}>
              Data Sufficiency
            </span>
            <span style={{ color: "#FFF", fontFamily: "Poppins, sans-serif", fontSize: isMobile ? "13px" : "18px", fontWeight: 700, lineHeight: "140%" }}>
              {sufficiencyText}
            </span>
          </div>

          {/* Data In-Sufficiency */}
          <div
            style={{
              display: "inline-flex",
              flexDirection: "column",
              flex: isMobile ? 1 : undefined,
              alignSelf: "flex-start",
              width: isMobile ? undefined : 217,
              boxSizing: "border-box",
              gap: 6,
              padding: isMobile ? "12px 10px 12px 10px" : "20px 72px 29px 24px",
              borderRadius: 20,
              background: "linear-gradient(127deg, #060C29 28.26%, rgba(4, 12, 48, 0.50) 91.2%)",
              backdropFilter: "blur(60px)",
              WebkitBackdropFilter: "blur(60px)",
            }}
          >
            <span style={{ color: "#A0AEC0", fontSize: isMobile ? "10px" : "12px", fontWeight: 500, lineHeight: "100%", whiteSpace: isMobile ? "nowrap" : undefined }}>
              Data In-Sufficiency
            </span>
            <span style={{ color: "#FFF", fontFamily: "Poppins, sans-serif", fontSize: isMobile ? "13px" : "18px", fontWeight: 700, lineHeight: "140%" }}>
              {insufficiencyText}
            </span>
          </div>
        </div>

        {/* Right: Circular Onboarding Progress */}
        <div style={isMobile ? { position: "relative", width: 160, height: 160, alignSelf: "center" } : { position: "absolute", top: 87, right: 31, width: 206, height: 206 }}>
          <svg width={isMobile ? "160" : "193"} height={isMobile ? "160" : "206"} viewBox="0 0 193 206" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M188.877 59.1477C192.111 57.4964 193.412 53.5237 191.558 50.4019C183.276 36.4583 171.801 24.6389 158.041 15.9396C142.425 6.06686 124.44 0.576164 105.973 0.0429122C87.5053 -0.490339 69.2343 3.95349 53.0745 12.9087C36.9147 21.8639 23.461 35.0008 14.1235 50.9427C4.78586 66.8847 -0.0919045 85.0447 0.00131101 103.52C0.0945265 121.995 5.15529 140.105 14.6533 155.951C24.1513 171.798 37.7368 184.799 53.9861 193.59C68.3041 201.337 84.2259 205.565 100.438 205.968C104.068 206.058 106.897 202.981 106.756 199.353C106.614 195.724 103.555 192.923 99.9265 192.799C86.0737 192.325 72.4862 188.65 60.243 182.026C46.068 174.357 34.2168 163.016 25.9313 149.192C17.6458 135.368 13.2311 119.57 13.1498 103.453C13.0684 87.3368 17.3235 71.495 25.4691 57.5882C33.6147 43.6814 45.3509 32.2215 59.4478 24.4094C73.5447 16.5974 89.4833 12.7209 105.593 13.1861C121.703 13.6512 137.392 18.441 151.014 27.0534C162.781 34.4921 172.631 44.546 179.821 56.3968C181.704 59.5011 185.643 60.7989 188.877 59.1477Z" fill="url(#paint0_linear_260_537)"/>
            <defs>
              <linearGradient id="paint0_linear_260_537" x1="103" y1="0" x2="103" y2="190" gradientUnits="userSpaceOnUse">
                <stop stopColor="#05CD99"/>
                <stop offset="1" stopColor="#05CD99" stopOpacity="0"/>
              </linearGradient>
            </defs>
          </svg>

          {/* Centered text */}
          <div style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}>
            <span style={{ fontSize: 12, fontWeight: 500, color: "#A0AEC0", lineHeight: "120%" }}>Onboarding</span>
            <span style={{ fontFamily: "Poppins, sans-serif", fontSize: isMobile ? 36 : 50, fontWeight: 700, color: "#FFF", lineHeight: "100%", margin: "4px 0 2px" }}>
              {onboardingPercentage}
            </span>
            <span style={{ fontSize: 11, fontWeight: 500, color: "#A0AEC0", lineHeight: "120%" }}>% Complete</span>
          </div>
        </div>
      </div>

      {/* Global CSS for dots button hover */}
      <style jsx global>{`
        .profile-dots-btn:hover {
          background: rgba(255, 255, 255, 0.15) !important;
        }
        .profile-menu-item:hover {
          background: rgba(255, 255, 255, 0.08) !important;
        }
        @media (max-width: 767px) {
          .dashboard-card {
            max-width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}
