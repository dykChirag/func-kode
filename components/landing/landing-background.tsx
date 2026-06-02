import { LANDING_ASSETS } from "@/components/landing/landing-assets";

const GRAIN_STYLE = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
  backgroundRepeat: "repeat",
  backgroundSize: "128px 128px",
} as const;

function BgImg({ src, className }: { src: string; className: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      decoding="async"
      fetchPriority="low"
      className={`pointer-events-none absolute max-w-none ${className}`}
    />
  );
}

/** Full landing page background — hero + lower sections (Figma 1440×4727 canvas). */
export function LandingBackground() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden isolate [transform:translateZ(0)]"
      aria-hidden
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #040710 4%, #7020BF 35%, #111B34 64%, #111B34 88%)",
        }}
      />

      <div className="absolute left-1/2 top-0 h-[4727px] w-full max-w-[1440px] -translate-x-1/2">
        {/* ── Hero zone ── */}
        <div className="absolute inset-x-0 top-0 h-[977px]">
          <div className="absolute left-[541px] top-[246px] h-[579px] w-[579px] rounded-full border border-[#00C9B7] bg-[#7020BF] blur-[200px] max-lg:left-[50%] max-lg:top-[160px] max-lg:h-[300px] max-lg:w-[300px] max-lg:-translate-x-1/2 max-lg:blur-[120px]" />
          <div className="absolute -right-4 top-[40px] h-[400px] w-[280px] rounded-full bg-[#00C9B7]/25 blur-[90px] max-lg:h-[220px] max-lg:w-[180px]" />
          <div className="absolute -right-8 top-[520px] h-[320px] w-[240px] rounded-full bg-[#00C9B7]/15 blur-[80px] max-lg:hidden" />

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

        {/* ── Mid / lower decorative layers ── */}
        <div className="absolute left-[345px] top-[1488px] h-[587px] w-[852px] rounded-full bg-[rgba(244,162,89,0.1)] blur-[200px]" />

        <BgImg
          src={LANDING_ASSETS.bgMidFlowLines}
          className="-left-[15px] top-[890px] h-[1760px] w-[2276px] max-lg:-left-[200px] max-lg:top-[820px] max-lg:h-[900px] max-lg:w-[1200px]"
        />
        <BgImg
          src={LANDING_ASSETS.bgLowerTopography}
          className="-left-[1207px] top-[2402px] h-[3307px] w-[4789px] opacity-40 max-lg:-left-[800px] max-lg:top-[2000px] max-lg:h-[1800px] max-lg:w-[2600px]"
        />
        <BgImg
          src={LANDING_ASSETS.bgLowerSideLines}
          className="-left-[573px] top-[3485px] h-[1624px] w-[839px] opacity-30 max-lg:-left-[300px] max-lg:top-[3200px] max-lg:h-[900px] max-lg:w-[480px]"
        />

        {/* ── Section background bands ── */}
        <div className="absolute inset-x-0 top-[977px] h-[687px] bg-[rgba(17,15,15,0.25)]" />

        <div className="absolute inset-x-0 top-[2358px] h-[596px] bg-[rgba(0,0,0,0.25)]">
          <BgImg
            src={LANDING_ASSETS.sectionTeamsIllustration}
            className="left-0 top-[120px] h-[361px] w-[798px] max-lg:h-auto max-lg:w-[90%]"
          />
        </div>

        <div className="absolute inset-x-0 top-[3104px] h-[596px] bg-[rgba(0,0,0,0.25)]">
          <BgImg
            src={LANDING_ASSETS.sectionDevelopersIllustration}
            className="left-0 top-[120px] h-[361px] w-[798px] max-lg:h-auto max-lg:w-[90%]"
          />
        </div>

        <div className="absolute inset-x-0 top-[3716px] h-[524px] bg-[rgba(17,15,15,0.25)] px-[70px]">
          <div className="mx-auto mt-6 h-[420px] w-full max-w-[1300px] rounded bg-[#F4A259]" />
        </div>

        <div className="absolute inset-x-0 top-[4224px] h-[503px] bg-[rgba(0,0,0,0.25)]" />
      </div>

      <div
        className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
        style={GRAIN_STYLE}
      />
    </div>
  );
}
