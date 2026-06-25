"use client";
import React from "react";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

interface EventsParticipatedProps {
  count?: number;
  trend?: string;
  onIconClick?: () => void;
}

export function EventsParticipated({
  count = 15,
  trend = "-14%",
  onIconClick,
}: EventsParticipatedProps) {
  return (
    <div
      className={`${poppins.className} dashboard-card`}
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
            width: "100%",
            display: "block",
          }}
        >
          Events Participated
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
              color: "#FF3B30", // Red trend color
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

      {/* Calendar Icon Button */}
      <button
        onClick={onIconClick}
        aria-label="View events"
        className="events-btn dashboard-card-btn"
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
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19.5354 3.98194C19.7057 3.96229 20.089 3.96961 20.2721 3.96879L21.6422 3.96313C21.5934 4.53882 21.6264 5.437 21.62 6.04462C21.8242 6.0394 22.0284 6.03577 22.2327 6.03372C22.9581 6.02921 23.5494 6.1074 24.0859 6.63287C24.8221 7.35393 24.6811 8.16489 24.679 9.10966L24.6766 11.8005L24.6805 21.8559C24.682 22.7273 24.7636 23.2439 24.0945 23.9377C23.465 24.5903 22.6618 24.5536 21.8189 24.5486L12.2054 24.5483L9.51109 24.5495C9.0586 24.5496 8.29735 24.5717 7.87506 24.5058C7.4717 24.4443 7.0977 24.2582 6.80552 23.9734C6.33279 23.5177 6.15235 22.9364 6.15244 22.2924C6.15282 19.0571 6.15695 15.8189 6.15964 12.5839L6.16152 9.52242C6.16254 8.23954 5.97613 6.80971 7.43069 6.19556C7.92469 5.98699 8.71855 6.03586 9.26341 6.02968C9.23599 5.3748 9.26883 4.64897 9.25081 3.97441C9.87451 3.99369 10.5993 3.97954 11.224 3.97201L11.2884 3.98139C11.3456 4.06854 11.33 5.81467 11.3081 6.04096C14.0391 6.00387 16.814 6.0457 19.552 6.03223C19.5121 5.44518 19.5377 4.58874 19.5354 3.98194ZM8.23691 22.501L17.5951 22.4935C19.2162 22.494 21.0427 22.5334 22.6465 22.4738C22.5621 19.2071 22.6719 15.9056 22.6264 12.6363C22.6197 12.1542 22.6224 11.648 22.6439 11.1672C22.4188 11.1942 21.4722 11.1653 21.1838 11.1649L17.7618 11.1633L11.2973 11.1637C10.3192 11.164 9.19216 11.1961 8.23407 11.1689L8.23691 22.501Z" fill="white"/>
            <path d="M19.0033 13.2329C19.206 13.3838 19.8522 14.082 20.1058 14.3212C19.7714 14.6751 19.3577 15.0605 19.0059 15.4134L15.8228 18.5928C15.2198 19.1956 14.5676 19.8265 13.9906 20.4497C13.2821 19.7217 12.5656 19.0016 11.8413 18.2893C11.6687 18.111 10.8055 17.3323 10.8048 17.1651C10.804 16.9583 11.5917 16.2728 11.7724 16.0892C12.0521 16.3001 12.2452 16.5292 12.4908 16.7622C12.9824 17.2285 13.5028 17.8282 14.0066 18.2677C14.4619 17.7223 15.291 16.417L19.0033 13.2329Z" fill="white"/>
          </svg>
      </button>

      <style jsx global>{`
        .events-btn:hover {
          transform: scale(1.05);
          background: #0066de;
        }
        .events-btn:active {
          transform: scale(0.95);
        }
        .dashboard-card-trend {
          font-size: 14px;
        }
        @media (max-width: 767px) {
          .dashboard-card {
            max-width: 100% !important;
            padding: 12px 10px 12px 14px !important;
            border-radius: 16px !important;
          }
          .dashboard-card-title {
            font-size: 10px !important;
            width: 100% !important;
          }
          .dashboard-card-value {
            font-size: 16px !important;
          }
          .dashboard-card-trend {
            font-size: 11px !important;
          }
          .dashboard-card-btn {
            width: 32px !important;
            height: 32px !important;
            top: 24px !important;
            right: 10px !important;
            border-radius: 8px !important;
          }
          .dashboard-card-btn svg {
            width: 16px !important;
            height: 16px !important;
          }
        }
      `}</style>
    </div>
  );
}
