"use client";
import { useState, useLayoutEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus_Jakarta_Sans } from "next/font/google";
import { createClient } from "@/lib/supabase/client";
import posthog from "posthog-js";
import { ANALYTICS_EVENTS, track } from "@/lib/analytics";
import { DASHBOARD_ASSETS } from "@/lib/dashboard-assets";
import { PatchIdScore } from "@/components/dashboard/patch-id-score";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

/* ── Page ── */
export default function DashboardPage() {
  const router = useRouter();

  const [open, setOpen] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [scale, setScale] = useState(1);
  const [viewH, setViewH] = useState(900);
  const [isMobile, setIsMobile] = useState(false);

  const scoreData = {
    score_total: null,
    sufficient_data: true,
    explanation: "Your score is in the top 15% of active contributors. Keep merging clean code!",
    checks: { min_prs: true, has_merged: true, recency: true },
  };

  useLayoutEffect(() => {
    setMounted(true);
    const update = () => {
      const width = document.documentElement.clientWidth;
      setIsMobile(width < 768);
      setScale(Math.min(
        1,
        width / 1920
      ));
      setViewH(window.innerHeight);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const handleLogout = async () => {
    track(ANALYTICS_EVENTS.LOGOUT);
    const supabase = createClient();
    await supabase.auth.signOut();
    posthog.reset();
    router.push("/auth/login");
  };

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
        overflowX: "clip",
        overflowY: "auto",
        background: "linear-gradient(180deg, #6325B0 0%, #0D1527 78%)",
      }}
    >
      {/* ── Sidebar (raccoon toggle + mobile drawer + desktop panel) — outside canvas so position:fixed works ── */}
      <DashboardSidebar
        open={open}
        setOpen={setOpen}
        isMobile={isMobile}
        handleLogout={handleLogout}
        currentSidebarMaxH={currentSidebarMaxH}
        scale={currentScale}
      />

      <div
        style={{
          width: 1920 * currentScale,
          height: typeof currentInnerMinH === "number" ? currentInnerMinH * currentScale : currentInnerMinH,
          overflow: "hidden",
          position: "relative",
          opacity: mounted ? 1 : 0,
          transition: "opacity 0.15s ease-in-out",
        }}
      >
        <div
          suppressHydrationWarning
          className={jakarta.className}
          style={{
            position: "relative",
            width: 1920,
            minHeight: currentInnerMinH,
            transformOrigin: "top left",
            transform: `scale(${currentScale})`,
            background: "linear-gradient(180deg, #6325B0 0%, #0D1527 78%)",
            color: "white",
            overflow: "hidden",
          }}
        >
          {/* Background waves — static SVG, GPU-cached */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            aria-hidden="true"
            alt=""
            decoding="async"
            fetchPriority="low"
            src={DASHBOARD_ASSETS.bgWaves}
            className="dashboard-bg"
          />

          {/* Main content */}
          <main style={{
            marginLeft: isMobile ? 0 : (open ? 284 : 80),
            padding: isMobile ? "80px 16px 40px 16px" : "103.5px 24px 40px 24px",
            position: "relative",
            zIndex: 2,
            transition: "margin-left 0.25s ease",
            display: "flex",
            flexDirection: "column",
            gap: 24,
          }}>
            <PatchIdScore
              score_total={scoreData.score_total}
              sufficient_data={scoreData.sufficient_data}
            />
          </main>
        </div>
      </div>
    </div>
  );
}
