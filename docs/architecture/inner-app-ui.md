# Inner App UI Conventions

> **Status:** ✅ Implemented — issue [#118](https://github.com/patchid/func-kode/issues/118)  
> Part of epic [#116](https://github.com/patchid/func-kode/issues/116)

This document defines the UI baseline for all inner app pages (`/dashboard`, `/profile`, `/submit-project`, `/events`, `/events/[id]`, `/blog`, `/blog/[slug]`, `/onboard`). Follow these conventions when building or modifying inner app pages.

---

## Spacing

| Usage | Token | Class |
|---|---|---|
| Page container vertical padding | `space-8`–`space-12` | `py-8` or `py-12` |
| Card internal padding | `space-6` | `p-6` |
| Form field gap (label → input → helper) | `space-2` / `gap-4` | `space-y-2` or `gap-4` |
| Section gap | `space-8` | `mb-8` |

Do not use arbitrary values (`mt-5`, `px-3`, `py-7`) without a documented reason.

---

## Typography

| Element | Classes |
|---|---|
| Page heading `<h1>` | `text-3xl font-bold` |
| Section heading `<h2>` | `text-xl font-semibold` |
| Body copy | `text-base` (16px minimum) |
| Muted / secondary text | `text-muted-foreground` |
| Labels and helper text | `text-sm` or `text-xs` (labels only — not body copy) |

**Never** use `text-xs` or `text-sm` for body paragraphs. Reserve them for metadata (author, date), helper text, and form labels.

---

## Dark Mode

All inner app pages must support dark mode. Rules:

- Headings using `text-brand-blue` (hardcoded `#2E4053` navy) **must** add `dark:text-white` — navy is invisible on dark backgrounds.
- Form cards or content cards that use `bg-white` **must** add `dark:bg-zinc-900` or `dark:bg-card`.
- All `<Card>` components must have `border border-border` — never `border-0`. `border-border` uses the CSS variable and is visible in both light and dark mode.
- Use `text-muted-foreground` instead of `text-gray-400`, `text-gray-500`, or opacity-based muted text.

```tsx
// ✅ Correct
<h1 className="text-3xl font-bold text-brand-blue dark:text-white">...</h1>
<Card className="border border-border shadow-lg">...</Card>

// ❌ Wrong
<h1 className="text-3xl font-bold text-brand-blue">...</h1>
<Card className="border-0 shadow-lg">...</Card>
```

---

## Mobile Layout (375px)

- Page containers: `px-4` minimum horizontal padding.
- Grids: always include a single-column base — `grid md:grid-cols-2 lg:grid-cols-3` (not `grid grid-cols-3`).
- Submit / CTA buttons: `w-full md:w-auto` — full-width on mobile, auto on desktop.
- Flex rows with multiple items (e.g. date + location): use `flex-wrap` to prevent overflow.

```tsx
// ✅ Correct — collapses to 1 col at 375px
<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

// ✅ Correct — full-width button on mobile
<Button className="w-full md:w-auto">Submit</Button>

// ✅ Correct — wraps on narrow screens
<div className="flex flex-wrap gap-x-4 gap-y-2">
```

---

## Logo / Brand Image

Use `/landing/logo.png` everywhere a brand image or mascot placeholder is needed. The old `/raccoon.png` path is deprecated.

```tsx
// ✅
<Image src="/landing/logo.png" alt="func(Kode) Logo" width={48} height={48} />

// ❌ Deprecated
<Image src="/raccoon.png" alt="..." />
```

---

## Related

- Issue [#118](https://github.com/patchid/func-kode/issues/118) — Dashboard UI Cleanup (this PR)
- Issue [#116](https://github.com/patchid/func-kode/issues/116) — Parent Epic
- [`docs/architecture/design-tokens.md`](./design-tokens.md) — Landing page tokens
- [`docs/architecture/site-chrome.md`](./site-chrome.md) — Navbar and footer conventions
