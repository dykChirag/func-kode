import { LANDING_ASSETS } from "@/lib/landing-assets";
import { LANDING_PAGE_GRADIENT } from "@/lib/landing-constants";

/**
 * Inline grain texture — SVG feTurbulence tiled at 128px.
 * opacity-[0.04] mix-blend-overlay per design spec.
 */
const GRAIN_STYLE: React.CSSProperties = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
  backgroundRepeat: "repeat",
  backgroundSize: "128px 128px",
} as const;

/**
 * BgLayer — purely decorative SVG/image layer.
 *
 * Uses a raw <img> (not next/image) because:
 *   1. These are decorative — no LCP, no CLS impact.
 *   2. fetchPriority="low" defers loading correctly.
 *   3. No need for Next.js width/height optimisation on background decoration.
 */
function BgLayer({
  src,
  className,
}: {
  src: string;
  className: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      decoding="async"
      fetchPriority="low"
      aria-hidden="true"
      className={`pointer-events-none absolute max-w-none select-none ${className}`}
    />
  );
}

/**
 * LandingBackground
 *
 * Full-page decorative background layer for the landing page.
 * Rendered absolutely behind all content — aria-hidden, pointer-events-none.
 *
 * Positioning strategy:
 *   - Horizontal: percentage of container width (no raw px).
 *   - Vertical within hero zone: percentage of hero zone height (clamp-based).
 *   - Section bands: NOT here — each section component owns its own band.
 *     See docs/components/landing-background.md for the rationale.
 *
 * Hero zone height derivation:
 *   Figma canvas = 1440 × 4727px. Hero zone = 977px tall.
 *   977 / 1440 = 67.85vw → clamp(600px, 67.85vw, 977px).
 */
export function LandingBackground() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden isolate"
      aria-hidden="true"
      role="presentation"
    >
      {/* ── 1. Full-page gradient ───────────────────────────────────────────
           Fixed px stops from Figma 4727px canvas — purple peak at ~1654px
           (about + how-it-works). Percentage stops shift purple away on short pages. */}
      <div className="absolute inset-0" style={{ background: LANDING_PAGE_GRADIENT }} />

      {/* ── 2. Hero zone decorative layers ─────────────────────────────────
           Height = clamp(600px, 67.85vw, 977px).
           At 1440px wide this is exactly 977px (Figma spec).
           All child positions use % of this zone's width/height — no raw px.

           Conversions from Figma (1440px canvas, 977px hero zone):
             left-[541px]   → left: 37.57%   (541 / 1440)
             top-[246px]    → top:  25.18%   (246 / 977)
             left-[636px]   → left: 44.17%   (636 / 1440)
             etc.
      */}
      <div
        className="absolute inset-x-0 top-0"
        style={{ height: "clamp(600px, 67.85vw, 977px)" }}
      >
        {/* Purple glow orb — centre-left, behind hero heading */}
        <div
          className="absolute rounded-full border border-landing-teal bg-landing-purple
                     blur-[200px] max-lg:blur-[120px]"
          style={{
            left: "37.57%",
            top: "25.18%",
            width: "clamp(200px, 40.21vw, 579px)",
            height: "clamp(200px, 40.21vw, 579px)",
          }}
        />

        {/* Teal glow — top-right edge */}
        <div
          className="absolute rounded-full bg-landing-teal/25 blur-[90px] max-lg:blur-[60px]"
          style={{
            right: "-1rem",
            top: "4.09%",
            width: "clamp(140px, 19.44vw, 280px)",
            height: "clamp(180px, 27.78vw, 400px)",
          }}
        />

        {/* Teal glow — right edge, lower (desktop only) */}
        <div
          className="absolute rounded-full bg-landing-teal/15 blur-[80px] max-lg:hidden"
          style={{
            right: "-2rem",
            top: "53.22%",
            width: "clamp(120px, 16.67vw, 240px)",
            height: "clamp(160px, 22.22vw, 320px)",
          }}
        />

        {/* SVG layer: accent lines — far left bleed
             Figma: left=-1066px top=-1279px  →  -74.03% / -130.91% */}
        <BgLayer
          src={LANDING_ASSETS.bgHeroAccentLines}
          className="top-[-130.91%] left-[-74.03%] w-[62.92%]
                     max-lg:top-[-81.88%] max-lg:left-[-48.61%] max-lg:w-[40.28%]"
        />

        {/* SVG layer: flow lines — sweeps diagonally across hero
             Figma: left=296px top=-344px  →  20.56% / -35.21% */}
        <BgLayer
          src={LANDING_ASSETS.bgHeroFlowLines}
          className="top-[-35.21%] left-[20.56%] w-[107.43%]
                     max-lg:top-[-18.43%] max-lg:left-[2.78%] max-lg:w-[55.56%]"
        />

        {/* SVG layer: topography mesh — large subtle fill at 40% opacity
             Figma: left=-514px top=-731px  →  -35.69% / -74.82% */}
        <BgLayer
          src={LANDING_ASSETS.bgHeroTopography}
          className="top-[-74.82%] left-[-35.69%] w-[226.04%] opacity-40
                     max-lg:top-[-38.89%] max-lg:left-[-19.44%] max-lg:w-[111.11%]"
        />

        {/* SVG layer: teal glow burst — right side behind mockup
             Figma: left=636px top=329px  →  44.17% / 33.67% */}
        <BgLayer
          src={LANDING_ASSETS.bgHeroTealGlow}
          className="top-[33.67%] left-[44.17%] w-[60.21%]
                     max-lg:left-auto max-lg:right-[-8%] max-lg:top-[18.42%] max-lg:w-[31.94%]"
        />

        {/* SVG layer: side lines — left edge, hidden on mobile
             Figma: left=-83px top=337px  →  -5.76% / 34.49% */}
        <BgLayer
          src={LANDING_ASSETS.bgHeroSideLines}
          className="top-[34.49%] left-[-5.76%] w-[39.58%] opacity-30 max-md:hidden"
        />
      </div>

      {/* ── 3. Mid / lower zone decorative layers ─────────────────────────────
           Starts below the hero zone; grows with page content (no fixed 4727px).
           Positions converted from Figma 1440×4727 canvas (mid zone origin = 977px).

           bgMidFlowLines   Figma top=890px  → -2.32% of mid zone (bleeds into hero)
           amber glow       Figma top=1488px → 13.63%
           bgLowerTopo      Figma top=2402px → 38%
           bgLowerSideLines Figma top=3485px → 66.88%
      */}
      <div
        className="absolute inset-x-0 bottom-0 left-1/2 w-full max-w-[1440px] -translate-x-1/2"
        style={{ top: "clamp(600px, 67.85vw, 977px)" }}
      >
        {/* Purple glow — about band (how-it-works uses page gradient only) */}
        <div
          className="absolute rounded-full border border-landing-teal/40 bg-landing-purple
                     blur-[200px] max-lg:blur-[120px]"
          style={{
            left: "15%",
            top: "5%",
            width: "70%",
            height: "28%",
          }}
        />

        {/* Amber glow — centre-right, behind about */}
        <div
          className="absolute rounded-full blur-[200px] max-lg:blur-[120px]"
          style={{
            left: "23.96%",
            top: "13.63%",
            width: "59.17%",
            height: "15.65%",
            background: "rgba(244, 162, 89, 0.1)",
          }}
        />

        {/* Flowing lines bridging hero → about → how-it-works */}
        <BgLayer
          src={LANDING_ASSETS.bgMidFlowLines}
          className="top-[-5%] -left-[1%] w-[158%] min-h-[1100px] h-auto
                     max-lg:top-[0%] max-lg:-left-[14%] max-lg:w-[120%] max-lg:min-h-[700px]"
        />

        {/* Large topography mesh — lower page only (avoid blue wash over purple section) */}
        <BgLayer
          src={LANDING_ASSETS.bgLowerTopography}
          className="top-[55%] -left-[84%] w-[333%] min-h-[1400px] h-auto opacity-40
                     max-lg:top-[50%] max-lg:-left-[55%] max-lg:w-[180%] max-lg:min-h-[900px]"
        />

        {/* Side accent lines — lower page, hidden on mobile */}
        <BgLayer
          src={LANDING_ASSETS.bgLowerSideLines}
          className="top-[75%] -left-[40%] w-[58%] min-h-[700px] h-auto opacity-30
                     max-lg:top-[70%] max-lg:-left-[20%] max-lg:w-[40%] max-lg:min-h-[450px] max-md:hidden"
        />
      </div>

      {/* ── 4. Grain overlay ────────────────────────────────────────────────
           Full-page, tiled SVG noise at opacity-[0.04] mix-blend-overlay.
           Matches design spec exactly — do not adjust opacity. */}
      <div
        className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
        style={GRAIN_STYLE}
      />
    </div>
  );
}
