# LandingBackground Component

> **Status:** 🚧 Template — fill in as part of issue #96

---

## Overview

`LandingBackground` is a full-page decorative background layer for the landing page. It is rendered **absolutely positioned behind all content** and is fully `pointer-events-none` and `aria-hidden`.

---

## Architecture

```
<LandingBackground>          ← pointer-events-none, aria-hidden, absolute inset-0
  ├── Gradient base          ← linear-gradient (dark navy → purple → dark blue)
  ├── Glow orbs              ← blurred divs (teal, purple)
  ├── SVG background layers  ← BgImg components (flow lines, topography, side lines)
  ├── Section bands          ← semi-transparent overlays per content section
  └── Grain overlay          ← SVG feTurbulence at opacity-[0.04]
```

---

## Positioning Strategy

> ⚠️ **Do not use hardcoded Figma pixel coordinates.**

All decorative layers must be positioned using **percentage-based values** relative to the 1440px canvas:

```tsx
// ❌ Wrong — hardcoded Figma pixel value
className="left-[541px] top-[246px]"

// ✅ Right — percentage of 1440px canvas
className="left-[37.6%] top-[15%]"
```

For section bands that need to align with content sections, co-locate the band style inside the section component itself rather than using a fixed `top` offset here.

---

## Background Gradient

```css
linear-gradient(180deg, #040710 4%, #7020BF 35%, #111B34 64%, #111B34 88%)
```

---

## Asset Reference

All SVG paths are managed in [`components/landing/landing-assets.ts`](../../components/landing/landing-assets.ts).

<!--TODO: add a table listing each asset, its visual role, and its approximate position -->

| Asset key | File | Visual Role |
|---|---|---|
| `bgHeroAccentLines` | `bg-hero-accent-lines.svg` | <!--TODO--> |
| `bgHeroFlowLines` | `bg-hero-flow-lines.svg` | <!--TODO--> |
| `bgHeroTopography` | `bg-hero-topography.svg` | <!--TODO--> |
| `bgHeroTealGlow` | `bg-hero-teal-glow.svg` | <!--TODO--> |
| `bgHeroSideLines` | `bg-hero-side-lines.svg` | <!--TODO--> |
| `bgMidFlowLines` | `bg-mid-flow-lines.svg` | <!--TODO--> |
| `bgLowerTopography` | `bg-lower-topography.svg` | <!--TODO--> |
| `bgLowerSideLines` | `bg-lower-side-lines.svg` | <!--TODO--> |

---

## Responsive Behaviour

<!--TODO: describe how the background adapts at each breakpoint -->

| Breakpoint | Behaviour |
|---|---|
| `< 768px` | <!--TODO--> |
| `768px – 1023px` | <!--TODO--> |
| `1024px – 1439px` | <!--TODO--> |
| `≥ 1440px` | Full Figma design |
