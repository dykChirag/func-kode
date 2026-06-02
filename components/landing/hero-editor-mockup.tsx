import { LANDING_ASSETS } from "@/components/landing/landing-assets";

/** Figma frame: 822×590 at x=572 on the 1440px canvas. */
export const HERO_EDITOR_WIDTH = 822;
export const HERO_EDITOR_HEIGHT = 590;

export function HeroEditorMockup() {
  return (
    <div
      className="relative isolate w-full max-w-[822px] min-[1440px]:w-[822px] [transform:translateZ(0)]"
      style={{ aspectRatio: `${HERO_EDITOR_WIDTH} / ${HERO_EDITOR_HEIGHT}` }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={LANDING_ASSETS.heroEditorMockup}
        alt="Platform preview"
        width={HERO_EDITOR_WIDTH}
        height={HERO_EDITOR_HEIGHT}
        decoding="async"
        fetchPriority="high"
        className="h-full w-full drop-shadow-[0_7px_22px_rgba(0,0,0,0.28)]"
      />
    </div>
  );
}
