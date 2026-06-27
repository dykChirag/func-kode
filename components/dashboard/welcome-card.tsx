"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

interface WelcomeCardProps {
  profile: {
    display_name: string;
    avatar_url: string | null;
    github_username: string | null;
  };
  project: {
    title: string;
    has_project: boolean;
    github_url: string;
  };
  metrics: {
    contributors_this_week: number;
    open_prs_count: number;
  };
  eventNotice: string;
  isMobile?: boolean;
}

export function WelcomeCard({ profile, project, metrics, eventNotice, isMobile = false }: WelcomeCardProps) {
  const [greeting, setGreeting] = useState("Good Morning");

  useEffect(() => {
    const hours = new Date().getHours();
    if (hours >= 5 && hours < 12) {
      setGreeting("Good Morning");
    } else if (hours >= 12 && hours < 17) {
      setGreeting("Good Afternoon");
    } else {
      setGreeting("Good Evening");
    }
  }, []);

  if (isMobile) {
    return (
      <div
        className={poppins.className}
        style={{
          position: "relative",
          width: "100%",
          borderRadius: 20,
          overflow: "hidden",
          boxShadow: "0px 4px 30px rgba(0, 0, 0, 0.4)",
          background: "linear-gradient(127deg, rgba(6, 11, 38, 0.74) 28.26%, rgba(26, 31, 55, 0.50) 91.2%)",
          border: "1.5px solid rgba(255, 255, 255, 0.1)",
          boxSizing: "border-box",
          padding: "24px 20px 20px 20px",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <div style={{ position: "absolute", inset: 0, background: 'url("/jellyfish.png") right center / cover no-repeat', opacity: 0.75, pointerEvents: "none" }} />
        <span style={{ fontSize: 12, fontWeight: 500, color: "#A0AEC0", zIndex: 1 }}>{greeting}</span>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#fff", margin: 0, zIndex: 1 }}>{profile.display_name}</h2>
        <p style={{ fontSize: 13, fontWeight: 400, lineHeight: "20px", color: "rgba(255,255,255,0.7)", margin: 0, zIndex: 1 }}>
          Your {project.title} project got{" "}
          <span style={{ color: "#00C9B7" }}>{metrics.contributors_this_week} new contributor{metrics.contributors_this_week === 1 ? "" : "s"}</span>{" "}
          this week.{" "}
          <span style={{ color: "#00C9B7" }}>{metrics.open_prs_count} open PR{metrics.open_prs_count === 1 ? "" : "s"}</span>{" "}
          waiting for your review.
        </p>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", margin: 0, zIndex: 1 }}>{eventNotice}</p>
        <Link href="/explore" className="welcome-card-cta" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#fff", textDecoration: "none", fontSize: 12, zIndex: 1 }}>
          Start from here <span>→</span>
        </Link>
        <style jsx global>{`.welcome-card-cta:hover { transform: translateX(4px); }`}</style>
      </div>
    );
  }

  return (
    <div
      className={poppins.className}
      style={{
        position: "relative",
        width: 652,
        height: 344,
        borderRadius: 20,
        overflow: "visible",
        boxShadow: "0px 4px 30px rgba(0, 0, 0, 0.4)",
        background: "linear-gradient(127deg, rgba(6, 11, 38, 0.74) 28.26%, rgba(26, 31, 55, 0.50) 91.2%)",
        border: "1.5px solid rgba(255, 255, 255, 0.1)",
        boxSizing: "border-box",
        transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
      }}
    >
      {/* Background Wrapper */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 20,
          overflow: "hidden",
          background: 'url("/jellyfish.png") center right / cover no-repeat',
          zIndex: 0,
          pointerEvents: "none",
          opacity: 0.9,
        }}
      />

      {/* Greeting Stack */}
      <div
        style={{
          position: "absolute",
          left: 37,
          top: 33,
          display: "flex",
          flexDirection: "column",
          gap: 6,
          zIndex: 1,
        }}
      >
        <span
          style={{
            display: "block",
            width: "auto",
            minWidth: 100,
            height: 14,
            fontSize: 14,
            fontWeight: 500,
            color: "#A0AEC0",
            fontStyle: "normal",
            lineHeight: "100%",
            fontFamily: poppins.style.fontFamily,
          }}
        >
          {greeting}
        </span>
        <h2
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: "#FFFFFF",
            margin: 0,
            lineHeight: "normal",
            fontFamily: poppins.style.fontFamily,
          }}
        >
          {profile.display_name}
        </h2>
      </div>

      {/* The Text Box: exactly 288x120px */}
      <p
        style={{
          position: "absolute",
          left: 37,
          top: 105,
          width: 288,
          height: 120,
          margin: 0,
          padding: 0,
          fontSize: 16,
          fontWeight: 400,
          lineHeight: "24px",
          color: "rgba(255, 255, 255, 0.7)",
          fontFamily: poppins.style.fontFamily,
          zIndex: 1,
          boxSizing: "border-box",
        }}
      >
        Your {project.title} project got{" "}
        <span style={{ color: "#00C9B7", fontWeight: 400, fontFamily: poppins.style.fontFamily }}>
          {metrics.contributors_this_week} new contributor{metrics.contributors_this_week === 1 ? "" : "s"}
        </span>{" "}
        this week.{" "}
        <span style={{ color: "#00C9B7", fontWeight: 400, fontFamily: poppins.style.fontFamily }}>
          {metrics.open_prs_count} open PR{metrics.open_prs_count === 1 ? "" : "s"}
        </span>{" "}
        waiting for your review.
        <br />
        <br />
        {eventNotice}
      </p>

      {/* CTA Action Link */}
      <div
        style={{
          position: "absolute",
          left: 37,
          top: 291,
          zIndex: 1,
        }}
      >
        <Link
          href="/explore"
          className="welcome-card-cta"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            color: "#FFFFFF",
            textDecoration: "none",
            fontSize: 12,
            fontWeight: 400,
            lineHeight: "100%",
            cursor: "pointer",
            transition: "transform 0.2s ease",
            fontFamily: poppins.style.fontFamily,
          }}
        >
          Start from here
          <span style={{ fontSize: 12 }}>→</span>
        </Link>
        <style jsx global>{`
          .welcome-card-cta:hover {
            transform: translateX(4px);
          }
        `}</style>
      </div>
    </div>
  );
}
