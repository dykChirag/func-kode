"use client";
import React, { useState } from "react";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

interface PatchIdScoreProps {
  score_total?: number | null;
  sufficient_data: boolean;
  onRefresh?: () => Promise<void> | void;
}

export function PatchIdScore({
  score_total = null,
  sufficient_data,
  onRefresh,
}: PatchIdScoreProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshClick = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    try {
      if (onRefresh) {
        await onRefresh();
      } else {
        // Mock a 1-second refresh delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    } catch (err) {
      console.error("Refresh failed:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div
      className={poppins.className}
      style={{
        position: "relative",
        width: 382,
        height: 80,
        borderRadius: 20,
        padding: "21.5px 17.5px 18.5px 21px",
        boxSizing: "border-box",
        background: "linear-gradient(127deg, rgba(6, 11, 38, 0.74) 28.26%, rgba(26, 31, 55, 0.50) 91.2%)",
        backgroundClip: "padding-box",
        backdropFilter: "blur(60px)",
        WebkitBackdropFilter: "blur(60px)",
        boxShadow: "0px 4px 30px rgba(0, 0, 0, 0.4)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
      }}
    >
      {/* Header Content Row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", height: "100%" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <span
            style={{
              color: "var(--Gray-Gray-400, #A0AEC0)",
              fontFamily: "Poppins, sans-serif",
              fontSize: "12px",
              fontStyle: "normal",
              fontWeight: 500,
              lineHeight: "100%",
              width: 87,
              display: "block",
            }}
          >
            Patch ID Score
          </span>
          <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
            <span
              style={{
                color: "#FFF",
                fontFamily: "Poppins, sans-serif",
                fontSize: "18px",
                fontStyle: "normal",
                fontWeight: 700,
                lineHeight: "140%",
              }}
            >
              {sufficient_data && score_total !== null ? `${score_total}/100` : "N/A"}
            </span>
            {sufficient_data && (
              <span
                style={{
                  color: "var(--primary-green-500-success-color, #01B574)",
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "14px",
                  fontStyle: "normal",
                  fontWeight: 700,
                  lineHeight: "140%",
                  width: 40,
                  display: "inline-block",
                }}
              >
                +55%
              </span>
            )}
          </div>
        </div>

        {/* Sync/Refresh Button */}
        <button
          onClick={handleRefreshClick}
          disabled={isRefreshing}
          aria-label="Sync rating score"
          className="patch-id-sync-btn"
          style={{
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
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              transform: isRefreshing ? "rotate(360deg)" : "rotate(0deg)",
              transition: isRefreshing ? "transform 1s linear infinite" : "transform 0.3s ease",
              animation: isRefreshing ? "patch-id-spin 1s linear infinite" : "none",
            }}
          >
            <path
              d="M19.3635 11.8159C19.3745 11.816 19.4157 11.8242 19.4291 11.8266C19.4724 11.9242 18.6127 14.7385 18.4957 15.1432L17.6453 18.0793C17.5198 18.5111 17.424 18.8944 17.2862 19.3333C17.0005 19.1281 16.6814 18.8074 16.4212 18.5688L14.9494 17.2068C13.583 18.0082 12.062 18.5101 10.487 18.6793C9.83422 18.7501 9.30441 18.7862 8.64045 18.7636C6.18248 18.6835 3.8149 17.8176 1.88524 16.293C1.6947 16.1476 1.49856 15.9617 1.32031 15.7989C1.80137 15.2873 2.51031 14.6883 3.03096 14.1985C3.23846 14.3521 3.43689 14.5429 3.64582 14.7033C5.97808 16.4942 9.15621 16.9759 11.9379 16.0597C12.3468 15.925 12.7701 15.7721 13.1498 15.5605C12.789 15.1894 12.394 14.8674 12.023 14.5073C11.7883 14.2795 11.5385 14.0601 11.2948 13.8415C11.558 13.7445 11.965 13.6504 12.2377 13.5845L13.4861 13.284L16.8533 12.4498L18.5946 12.012C18.8595 11.9443 19.1022 11.9013 19.3635 11.8159Z"
              fill="currentColor"
            />
            <path
              d="M3.46439 1.19977C3.60212 1.24655 5.50876 3.08196 5.80958 3.32755C7.33136 2.33425 9.79456 1.77205 11.5967 1.75799C14.274 1.7371 17.4843 2.79274 19.4048 4.71932C19.185 5.04513 18.7387 5.35222 18.4572 5.63839C18.2245 5.87499 17.9472 6.10413 17.7026 6.33526C16.6359 5.44003 15.5925 4.74747 14.2199 4.37827C14.1761 4.37005 14.1184 4.35268 14.0743 4.34063C12.3279 3.86337 10.4383 3.92177 8.72304 4.49897C8.32296 4.6336 7.96208 4.80839 7.57534 4.9678C8.02522 5.35546 8.45618 5.80009 8.90243 6.19577C9.07999 6.35319 9.28733 6.56294 9.47942 6.69659L4.06317 8.04473C3.14966 8.27134 2.20173 8.48194 1.29639 8.71669C1.56641 7.66448 1.85704 6.70311 2.16901 5.66302C2.38716 4.91427 2.573 4.13532 2.81989 3.39608C3.05925 2.6794 3.20899 1.90061 3.46439 1.19977Z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>

      {/* CSS Styles for animations and hover */}
      <style jsx global>{`
        .patch-id-sync-btn:hover:not(:disabled) {
          transform: scale(1.05);
          background: #0066de;
        }
        .patch-id-sync-btn:active:not(:disabled) {
          transform: scale(0.95);
        }
        @keyframes patch-id-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
