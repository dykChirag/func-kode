"use client";

import { useState, useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
import { Plus_Jakarta_Sans, Poppins } from "next/font/google";
import { DASHBOARD_ASSETS } from "@/lib/dashboard-assets";
import { PatchIdScore } from "@/components/dashboard/patch-id-score";
import { ActivePullRequests } from "@/components/dashboard/active-pull-requests";
import { EventsParticipated } from "@/components/dashboard/events-participated";
import { GetPatchIdScoreCard } from "@/components/dashboard/get-patch-id-score-card";
import { SidebarUserActions } from "@/components/dashboard/sidebar-user-actions";
import { DashboardSearch } from "@/components/dashboard/dashboard-search";
import { DiscordButton } from "@/components/dashboard/discord-button";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export default function DashboardPage() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [scale, setScale] = useState(1);
  const [viewH, setViewH] = useState(900);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  // Map pathname to display title
  const getPageTitle = (path: string) => {
    if (path.startsWith("/dashboard")) return "Dashboard";
    if (path.startsWith("/explore")) return "Explore";
    if (path.startsWith("/projects")) return "Projects";
    if (path.startsWith("/docs")) return "Docs";
    if (path.startsWith("/events")) return "Events";
    if (path.startsWith("/discussions")) return "Discussions";
    if (path.startsWith("/leaderboard")) return "Leader Board";
    if (path.startsWith("/notifications")) return "Notifications";
    if (path.startsWith("/activity-logs")) return "Activity Logs";
    if (path.startsWith("/settings")) return "Settings";
    if (path.startsWith("/profile")) return "Profile";
    
    // Fallback: extract from path
    const segment = path.split("/").filter(Boolean)[0];
    if (!segment) return "Home";
    return segment.charAt(0).toUpperCase() + segment.slice(1);
  };

  const pageTitle = getPageTitle(pathname);

  const scoreData = {
    score_total: null,
    sufficient_data: true,
    explanation: "Your score is in the top 15% of active contributors. Keep merging clean code!",
    checks: { min_prs: true, has_merged: true, recency: true },
  };

  useLayoutEffect(() => {
    setMounted(true);
    setOpen(document.documentElement.clientWidth > 960);
    const update = () => {
      const width = document.documentElement.clientWidth;
      setIsMobile(width < 768);
      setScale(Math.max(0.4, Math.min(1, width / 1920)));
      setViewH(window.innerHeight);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const innerMinH = Math.max(1654, Math.ceil(viewH / scale));

  const currentScale = mounted ? scale : 1;
  const currentInnerMinH = mounted ? innerMinH : "100vh";
  const currentSidebarMaxH = mounted ? Math.min(1153, Math.ceil(viewH / scale) - 20) : 1153;

  return (
    <div
      suppressHydrationWarning
      style={{
        width: "100%",
        height: "100vh",
        overflowX: "hidden",
        overflowY: "auto",
        background: "linear-gradient(146deg, #6325B0 0%, #0D1527 62.58%)",
      }}
    >
      <DashboardSidebar
        mode="mobile"
        open={open}
        onOpenChange={setOpen}
        isMobile={isMobile}
      />

      <div
        style={{
          width: isMobile ? "100%" : 1920 * currentScale,
          height: isMobile ? "auto" : (typeof currentInnerMinH === "number" ? currentInnerMinH * currentScale : currentInnerMinH),
          overflow: "hidden",
          position: "relative",
          opacity: mounted ? 1 : 0,
          transition: "opacity 0.15s ease-in-out",
        }}
      >
        <div
          suppressHydrationWarning
          className={`${jakarta.className} dashboard-canvas`}
          style={{
            position: "relative",
            width: isMobile ? "100%" : 1920,
            minHeight: isMobile ? "100vh" : currentInnerMinH,
            transformOrigin: "top left",
            transform: isMobile ? "none" : `scale(${currentScale})`,
            background: "linear-gradient(146deg, #6325B0 0%, #0D1527 62.58%)",
            color: "white",
            overflow: "hidden",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            aria-hidden="true"
            alt=""
            decoding="async"
            fetchPriority="low"
            src={DASHBOARD_ASSETS.bgWaves}
            className="dashboard-bg"
          />

          <DashboardSidebar
            mode="desktop"
            open={open}
            onOpenChange={setOpen}
            isMobile={isMobile}
            sidebarMaxH={currentSidebarMaxH}
          />

          <main
            style={{
              marginLeft: isMobile ? 0 : (open ? 274 : 0),
              padding: isMobile
                ? "80px 16px 40px 16px"
                : `103.5px ${open ? 41 : 113}px 40px ${open ? 41 : 113}px`,
              position: "relative",
              zIndex: 2,
              transition: "margin-left 0.25s ease, padding-left 0.25s ease, padding-right 0.25s ease",
              display: "flex",
              flexDirection: "column",
              gap: 24,
            }}
          >
            {/* Breadcrumbs & Page Title */}
            <div
              className={poppins.className}
              style={
                isMobile
                  ? {
                      display: "flex",
                      flexDirection: "column",
                      gap: 6,
                      alignSelf: "flex-start",
                      fontFamily: poppins.style.fontFamily,
                    }
                  : {
                      position: "absolute",
                      top: 37,
                      left: open ? 41 : 113,
                      display: "flex",
                      flexDirection: "column",
                      gap: 6,
                      alignSelf: "flex-start",
                      transition: "left 0.25s ease",
                      fontFamily: poppins.style.fontFamily,
                    }
              }
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontFamily: poppins.style.fontFamily,
                  lineHeight: "100%",
                }}
              >
                <span style={{ color: "#A0AEC0", fontSize: 12, fontWeight: 400, fontFamily: poppins.style.fontFamily }}>Pages</span>
                <span style={{ color: "white", fontSize: 12, fontWeight: 500, fontFamily: poppins.style.fontFamily }}>/</span>
                <span style={{ color: "white", fontSize: 12, fontWeight: 500, fontFamily: poppins.style.fontFamily }}>{pageTitle}</span>
              </div>
              <h1
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: "#FFF",
                  margin: 0,
                  lineHeight: "19.6px",
                  fontFamily: poppins.style.fontFamily,
                }}
              >
                {pageTitle}
              </h1>
            </div>

            {/* Top-right nav icons */}
            <div
              style={
                isMobile
                  ? {
                      position: "absolute",
                      top: 16,
                      right: 16,
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      zIndex: 10,
                    }
                  : {
                      position: "absolute",
                      top: 22,
                      right: 47,
                      display: "flex",
                      alignItems: "center",
                      gap: 45,
                      zIndex: 10,
                    }
              }
            >
              <DiscordButton iconOnly={isMobile} />
              <DashboardSearch iconOnly={isMobile} />
              <SidebarUserActions />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: mounted 
                  ? (isMobile 
                      ? "repeat(2, 1fr)" 
                      : "repeat(4, minmax(260px, 382px))"
                    )
                  : "repeat(4, 1fr)",
                gap: isMobile ? 12 : 18,
                width: "100%",
                justifyContent: isMobile ? "stretch" : "space-between",
              }}
            >
              <PatchIdScore
                score_total={scoreData.score_total}
                sufficient_data={scoreData.sufficient_data}
              />
              <ActivePullRequests />
              <EventsParticipated />
              <GetPatchIdScoreCard />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
