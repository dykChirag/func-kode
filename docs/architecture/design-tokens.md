# Design Tokens

> **Status:** 🚧 Template — fill in as part of issue #95

This document is the single source of truth for all design tokens used in the landing page. **Do not use arbitrary Tailwind pixel values** — use these tokens instead.

---

## Typography — Landing Page

Defined in `tailwind.config.ts` under `theme.extend.fontSize`.

| Token | Value | Usage |
|---|---|---|
| `landing-hero` | `46px / 54.1px` | Desktop H1 (≥1440px) |
| `landing-h1-md` | `40px / 48px` | Tablet H1 (768px–1439px) |
| `landing-h1-sm` | `32px / 1.18` | Mobile H1 (<768px) |
| `landing-label` | `14px` uppercase | Section labels above headings |
| `landing-body` | `16px / 25.4px` | Body copy |

<!--TODO: add actual tailwind.config.ts entries once #95 is merged -->

---

## Letter Spacing — Landing Page

Defined in `tailwind.config.ts` under `theme.extend.letterSpacing`.

| Token | Value | Usage |
|---|---|---|
| `landing-tight` | `-0.48px` | Body, label |
| `landing-h1` | `-1.38px` | H1 headings |
| `landing-cta` | `-0.45px` | CTA button text |
| `landing-badge` | `-0.36px` | Version badge, pill labels |

---

## Spacing Constants

Defined in `tailwind.config.ts` under `theme.extend.spacing`.

| Token | Value | Usage |
|---|---|---|
| `landing-canvas-px` | `122px` | Horizontal canvas inset at 1440px |
| `landing-cta-gap` | `47px` | Gap between CTA buttons (desktop) |

> **Note:** The hero mockup left offset (`572px`) and other layout-specific offsets are defined as named constants in `components/landing/landing-constants.ts`, not as Tailwind tokens.

---

## Colors — Landing Page

| Token | Hex | Usage |
|---|---|---|
| `landing-label` | `#EDFFD7` | Label text above H1 |
| `landing-teal` | `#00C9B7` | Teal accent (fork icon, glows) |

> Cross-reference with the global brand color palette in `tailwind.config.ts`.

---

## Background Gradient

```css
background: linear-gradient(180deg, #040710 4%, #7020BF 35%, #111B34 64%, #111B34 88%);
```

---

## ❌ What NOT to Do

```tsx
// Never do this — raw Figma values
<h1 className="text-[46px] tracking-[-1.38px] leading-[54.1px]">

// Do this instead
<h1 className="text-landing-hero tracking-landing-h1">
```
