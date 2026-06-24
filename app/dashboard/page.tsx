"use client";
import { useState, useLayoutEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
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
  const pathname = usePathname();
  const [open, setOpen] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [scale, setScale] = useState(1);
  const [viewH, setViewH] = useState(900);
  const [isMobileView, setIsMobileView] = useState(false);
  const [canvasH, setCanvasH] = useState(1654);
  const canvasRef = useRef<HTMLDivElement>(null);

  const scoreData = {
    score_total: null,
    sufficient_data: true,
    explanation: "Your score is in the top 15% of active contributors. Keep merging clean code!",
    checks: { min_prs: true, has_merged: true, recency: true },
  };

  useLayoutEffect(() => {
    setMounted(true);
    const vw0 = document.documentElement.clientWidth;
    setOpen(vw0 >= 1024);

    const update = () => {
      const vw = document.documentElement.clientWidth;
      setScale(Math.max(0.5, Math.min(1, vw / 1920)));
      setViewH(window.innerHeight);
      setIsMobileView(vw < 768);
    };
    update();
    window.addEventListener("resize", update);

    const ro = new ResizeObserver(() => {
      if (canvasRef.current) setCanvasH(canvasRef.current.scrollHeight);
    });
    if (canvasRef.current) ro.observe(canvasRef.current);

    return () => {
      window.removeEventListener("resize", update);
      ro.disconnect();
    };
  }, []);

  const handleLogout = async () => {
    track(ANALYTICS_EVENTS.LOGOUT);
    const supabase = createClient();
    await supabase.auth.signOut();
    posthog.reset();
    router.push("/auth/login");
  };

  const innerMinH = Math.max(canvasH, Math.ceil((viewH + 120) / scale));

  const currentScale       = mounted ? scale : 1;
  const currentInnerMinH   = mounted ? innerMinH : "100vh";
  const currentSidebarMaxH = mounted ? Math.min(1153, Math.ceil(viewH / scale) - 20) : 1153;

  const waveH    = typeof currentInnerMinH === "number" ? Math.round(currentInnerMinH * currentScale) : 827;
  const waveW    = Math.round(waveH * (1920 / 1654));
  const mobileBg = `url('${DASHBOARD_ASSETS.bgWaves}') 55% top / ${waveW}px ${waveH}px no-repeat local, linear-gradient(180deg, #6325B0 0%, #0D1527 78%) local`;

  return (
    <>
      {/* ── Sidebar (raccoon toggle + mobile drawer + desktop panel) ── */}
      <DashboardSidebar
        open={open}
        onToggle={() => setOpen(o => !o)}
        onLogout={handleLogout}
        pathname={pathname}
        scale={currentScale}
        sidebarMaxH={currentSidebarMaxH}
        isMobileView={isMobileView}
      />

      <div
        suppressHydrationWarning
        className="dashboard-outer"
        style={{
          width: "100%",
          minHeight: "100vh",
          overflowX: "clip",
          background: mounted && isMobileView ? mobileBg : "linear-gradient(180deg, #6325B0 0%, #0D1527 78%)",
        }}
      >
        {/* ── Canvas wrapper ── */}
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
            ref={canvasRef}
            suppressHydrationWarning
            className={`${jakarta.className} dashboard-canvas`}
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
              marginLeft: open ? 274 : 80,
              padding: "103.5px 24px 40px 24px",
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
    </>
  );
}
