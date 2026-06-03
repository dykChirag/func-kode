# HeroSection Component

> **Status:** 🚧 Template — fill in as part of issue #97

---

## Overview

The `HeroSection` is the first content section on the landing page. It contains the headline copy, CTA buttons, and the platform editor mockup image.

---

## Sub-Components

| Component | File | Role |
|---|---|---|
| `HeroSection` | `components/landing/hero-section.tsx` | Layout, copy, CTAs |
| `HeroEditorMockup` | `components/landing/hero-editor-mockup.tsx` | Platform preview image |

---

## Copy

| Element | Text |
|---|---|
| Label | `Trust commits, not cover letters` |
| H1 line 1 | `Build together.` |
| H1 line 2 | `Ship Faster.` |
| H1 line 3 | `Contribute with purpose.` |
| Body | `func(kode) is an open-source developer platform for the Patch ID community. Sign up with GitHub, join collaborative builds, and contribute to projects that matter.` |
| CTA primary | `Start Contributing` → `/auth/login` |
| CTA secondary | `Explore the project` → `/projects` |

---

## Design Tokens Used

All sizing values come from the design tokens defined in [`architecture/design-tokens.md`](../architecture/design-tokens.md). No raw pixel values in this component.

| Element | Token |
|---|---|
| Label | `text-landing-label`, `tracking-landing-tight` |
| H1 | `text-landing-hero` (desktop), `text-landing-h1-md` (tablet), `text-landing-h1-sm` (mobile) |
| Body | `text-landing-body`, `tracking-landing-tight` |
| CTA gap | `gap-landing-cta` |

---

## Layout

```
Mobile (< 1024px):    Single column, centred
                      [Copy block]
                      [Editor mockup below]

Desktop (≥ 1024px):   Two columns
                      [Copy block left]  [Editor mockup right]

1440px (Figma spec):  Absolute positioning within 1440px canvas
                      Copy: left=122px   Mockup: left=572px
```

---

## HeroEditorMockup

- Image: `LANDING_ASSETS.heroEditorMockup` (`/landing/hero-editor-2.svg`)
- Dimensions: `822 × 590`
- `fetchPriority="high"` — this is the LCP element
- `decoding="async"`
- Drop shadow: `drop-shadow-[0_7px_22px_rgba(0,0,0,0.28)]`

---

## Responsive QA Checklist

- [ ] 375px — stacked, no overflow, copy readable
- [ ] 768px — stacked or early two-col
- [ ] 1024px — two-column layout active
- [ ] 1280px — comfortable spacing
- [ ] 1440px — pixel-perfect Figma match
