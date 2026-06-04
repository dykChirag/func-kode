# Navbar Component

> **Status:** ✅ Implemented — issue [#94](https://github.com/patchid/func-kode/issues/94)

---

## Overview

The `Navbar` (`components/navbar.tsx`) is the global navigation bar for func(kode). It matches the updated Figma landing design and is rendered on **every route** via `SiteChrome`.

Features:

- Logo image + version badge
- Primary nav links (landing-page anchors)
- GitHub fork count button (teal fork icon)
- Auth-aware CTA area (`Connect` or logged-in controls)
- Responsive mobile hamburger drawer

---

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `forkCount` | `number \| null` | `null` | Live GitHub fork count, fetched server-side and passed from `app/layout.tsx` via `SiteChrome`. Never fetched client-side from `api.github.com`. |

```tsx
<Navbar forkCount={42} />
```

---

## Nav Items

All routes use the same landing-page anchor links:

| Label | href |
|---|---|
| func(kode) | `/#func-kode` |
| How It Works | `/#how-it-works` |
| Teams & Platforms | `/#for-teams` |
| For Developers | `/#for-developers` |
| Contact Us | `/#contact-us` |

> **Known limitation:** These are landing-page anchor links. On `/dashboard`, `/projects`, etc. they navigate back to `/#section` on the home page. Tracked for a follow-up — add a `variant` prop for app-level nav items before the full landing page ships. See [issue #TBD](https://github.com/patchid/func-kode/issues) (open after merge).

---

## Auth State

The Navbar is auth-aware. It renders differently based on the user's Supabase session:

| State | Desktop | Mobile drawer |
|---|---|---|
| Logged out | White `Connect` pill → `/auth/login` | `Connect` button at bottom of drawer |
| Logged in | `@username ▾` dropdown (same slot as Connect) | Account section with Profile, Dashboard, Logout links |

### Logged-in dropdown menu

When authenticated, the Connect button is replaced by a compact **account dropdown** (Radix `DropdownMenu`):

| Item | Destination |
|---|---|
| Profile | `/onboard` if onboarding incomplete, otherwise `/profile` |
| Dashboard | `/dashboard` |
| Logout | Signs out via Supabase and redirects to `/auth/login` |

Auth state uses `@supabase/ssr` browser client (`lib/supabase/client.ts`) — not `@supabase/auth-helpers-nextjs` — so session cookies set by the OAuth callback are readable client-side.

```tsx
const supabase = createClient(); // lib/supabase/client.ts
supabase.auth.getUser();
supabase.auth.onAuthStateChange((_event, session) => { ... });
```

Display name priority: GitHub `@username` → full name → email prefix → `"User"`.

---

## GitHub Fork Count

**Strategy:** Server-side fetch in `app/layout.tsx` via `getGitHubStatsSafe()` with ISR caching (`revalidate: 3600`) and a **500ms timeout** so a slow GitHub API never blocks the root layout on cold start.

```text
app/layout.tsx (Server Component)
  └── getGitHubStatsSafe()      ← lib/github-stats.ts, cached 1 hr, non-blocking
        └── <SiteChrome forkCount={forks}>
              └── <Navbar forkCount={forks}>
```

> ⚠️ The Navbar **must not** call `api.github.com` from the client. Unauthenticated GitHub API calls are rate-limited to **60 requests/hour per IP**.

A public API route is also available at [`/api/github-stats`](../api/github-stats.md) for other consumers.

---

## Version Badge

The version badge reads `process.env.NEXT_PUBLIC_APP_VERSION`.

**Source of truth:** `package.json` → `"version"` field (currently `0.9.0`).

`next.config.ts` injects it at build time:

```ts
env: {
  NEXT_PUBLIC_APP_VERSION:
    process.env.NEXT_PUBLIC_APP_VERSION ?? packageJson.version,
},
```

To release a new version, bump `"version"` in `package.json` in a single commit — the badge updates everywhere automatically. Override locally only if needed:

```bash
# .env.local (optional override)
NEXT_PUBLIC_APP_VERSION=0.9.0
```

When scoring engine v1 ships, bump to `1.0.0` in `package.json`.

---

## Mobile Menu

- Hamburger button visible below `xl` breakpoint (1280px)
- Slide-in drawer from the right, `w-[min(100%,320px)]`
- Backdrop click closes menu
- `Escape` key closes menu
- `aria-expanded`, `aria-controls`, `aria-label` on hamburger trigger
- `document.body.overflow = 'hidden'` while open to prevent background scroll
- Touch targets ≥ 44×44px (`min-h-[44px]` on interactive elements)

---

## Assets

| Asset | Path | Registry |
|---|---|---|
| Logo | `/public/landing/logo.png` | `LANDING_ASSETS.logo` in `lib/landing-assets.ts` |

---

## Files

| File | Role |
|---|---|
| `components/navbar.tsx` | Navbar UI + auth dropdown + mobile menu |
| `lib/supabase/client.ts` | Browser Supabase client (`@supabase/ssr`) |
| `app/auth/callback/route.ts` | OAuth callback — sets session cookies on redirect |
| `lib/landing-assets.ts` | Shared landing asset registry (consolidated with PR #105) |
| `components/site-chrome.tsx` | Passes `forkCount` to Navbar on every route |
| `app/layout.tsx` | Fetches GitHub stats server-side |
| `lib/github-stats.ts` | Shared GitHub stats fetch + cache |
| `next.config.ts` | Injects `NEXT_PUBLIC_APP_VERSION` from `package.json` |

---

## Manual Verification

1. **`/`** — Navbar visible with logo, version badge (`0.9.0`), nav links, fork count, Connect CTA.
2. **`/dashboard`** (logged out) — same navbar; no client-side GitHub API calls in Network tab.
3. **`/dashboard`** (logged in) — `@username ▾` dropdown in Connect slot; menu has Profile, Dashboard, Logout; no `Connect` button.
4. **Mobile (375px)** — hamburger opens drawer; Escape and backdrop close it.
5. **Version bump** — change `package.json` version, restart dev server, badge updates.

---

## Related Work

| Item | Relationship |
|---|---|
| EPIC [#92](https://github.com/patchid/func-kode/issues/92) | Landing page rebuild |
| Issue [#93](https://github.com/patchid/func-kode/issues/93) | `SiteChrome` — must be merged first |
| PR [#105](https://github.com/patchid/func-kode/pull/105) | Full `lib/landing-assets.ts` registry — consolidated in this branch |
| Rejected PR [#91](https://github.com/patchid/func-kode/pull/91) | Original bundled PR this work was split from |
