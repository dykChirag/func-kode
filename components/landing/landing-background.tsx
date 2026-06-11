import { LANDING_ASSETS } from "@/lib/landing-assets";
import { FIGMA_CANVAS_HEIGHT_PX } from "@/lib/landing-constants";

const GRAIN_STYLE: React.CSSProperties = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
  backgroundRepeat: "repeat",
  backgroundSize: "128px 128px",
} as const;

/** Figma Y positions on 4727px canvas → % for content-driven page height. */
const WAVE_TOP = {
  amberGlow: 1488 / FIGMA_CANVAS_HEIGHT_PX,
  midFlow: 890 / FIGMA_CANVAS_HEIGHT_PX,
  lowerTopo: 2402 / FIGMA_CANVAS_HEIGHT_PX,
  lowerSide: 3485 / FIGMA_CANVAS_HEIGHT_PX,
} as const;

function BgImg({
  src,
  className,
  style,
}: {
  src: string;
  className: string;
  style?: React.CSSProperties;
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
      style={style}
    />
  );
}

/**
 * LandingBackground
 *
 * Wave decor from feat/ui-navbar-herosection / ProductLandingPage.tsx:
 *   - Hero zone: fixed Figma px layout (977px)
 *   - Mid/lower waves: Figma px positions as % of page height so decor
 *     stays aligned as LandingPageContent grows with all sections
 */
export function LandingBackground() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden isolate [transform:translateZ(0)]"
      aria-hidden="true"
      role="presentation"
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #040710 4%, #7020BF 35%, #111B34 64%, #111B34 88%)",
        }}
      />

      {/* Hero — feat/ui-navbar-herosection pixel layout */}
      <div className="absolute left-1/2 top-0 w-full max-w-[1440px] -translate-x-1/2">
        <div className="absolute inset-x-0 top-0 h-[977px]">
          <div
            className="
              absolute left-[541px] top-[246px] h-[579px] w-[579px] rounded-full
              border border-landing-teal bg-landing-purple blur-[200px]
              max-lg:left-1/2 max-lg:top-[160px] max-lg:h-[300px] max-lg:w-[300px]
              max-lg:-translate-x-1/2 max-lg:blur-[120px]
            "
          />
          <div className="absolute -right-4 top-[40px] h-[400px] w-[280px] rounded-full bg-landing-teal/25 blur-[90px] max-lg:h-[220px] max-lg:w-[180px]" />
          <div className="absolute -right-8 top-[520px] h-[320px] w-[240px] rounded-full bg-landing-teal/15 blur-[80px] max-lg:hidden" />

          <BgImg
            src={LANDING_ASSETS.bgHeroAccentLines}
            className="-left-[1066px] -top-[1279px] h-[940px] w-[906px] max-lg:-left-[700px] max-lg:-top-[800px] max-lg:h-[600px] max-lg:w-[580px]"
          />
          <BgImg
            src={LANDING_ASSETS.bgHeroFlowLines}
            className="-top-[344px] left-[296px] h-[1735px] w-[1547px] max-lg:-top-[180px] max-lg:left-[40px] max-lg:h-[900px] max-lg:w-[800px]"
          />
          <BgImg
            src={LANDING_ASSETS.bgHeroTopography}
            className="-left-[514px] -top-[731px] h-[3260px] w-[3255px] opacity-40 max-lg:-left-[280px] max-lg:-top-[380px] max-lg:h-[1600px] max-lg:w-[1600px]"
          />
          <BgImg
            src={LANDING_ASSETS.bgHeroTealGlow}
            className="left-[636px] top-[329px] h-[917px] w-[867px] max-lg:left-auto max-lg:right-[-8%] max-lg:top-[180px] max-lg:h-[480px] max-lg:w-[460px]"
          />
          <BgImg
            src={LANDING_ASSETS.bgHeroSideLines}
            className="-left-[83px] top-[337px] h-[1600px] w-[570px] opacity-30 max-md:hidden"
          />
        </div>
      </div>

      {/*
        Mid / lower waves — same assets + sizes as feat/ui-navbar-herosection,
        tops as % of full page height (Figma Y / 4727).
      */}
      <div className="absolute inset-0 left-1/2 w-full max-w-[1440px] -translate-x-1/2">
        <div
          className="absolute left-[345px] h-[587px] w-[852px] rounded-full bg-[rgba(244,162,89,0.1)] blur-[200px] max-lg:left-[15%] max-lg:w-[70%]"
          style={{ top: `${WAVE_TOP.amberGlow * 100}%` }}
        />

        <BgImg
          src={LANDING_ASSETS.bgMidFlowLines}
          className="-left-[15px] h-[1760px] w-[2276px] max-lg:-left-[200px] max-lg:h-[900px] max-lg:w-[1200px]"
          style={{ top: `${WAVE_TOP.midFlow * 100}%` }}
        />
        <BgImg
          src={LANDING_ASSETS.bgLowerTopography}
          className="-left-[1207px] h-[3307px] w-[4789px] opacity-40 max-lg:-left-[800px] max-lg:h-[1800px] max-lg:w-[2600px]"
          style={{ top: `${WAVE_TOP.lowerTopo * 100}%` }}
        />
        <BgImg
          src={LANDING_ASSETS.bgLowerSideLines}
          className="-left-[573px] h-[1624px] w-[839px] opacity-30 max-lg:-left-[300px] max-lg:h-[900px] max-lg:w-[480px] max-md:opacity-20"
          style={{ top: `${WAVE_TOP.lowerSide * 100}%` }}
        />
      </div>

      <div
        className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
        style={GRAIN_STYLE}
      />
    </div>
  );
}
