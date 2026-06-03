# Navbar Component

> **Status:** 🚧 Template — fill in as part of issue #94

---

## Overview

The `Navbar` is a shared component used in two contexts:
1. **Landing page** — rendered inside `LandingPageContent`, sits on top of the dark gradient background
2. **App pages** — rendered by `SiteChrome` for all non-landing routes

---

## Props

<!--TODO: document props once the variant pattern is implemented -->

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `'landing' \| 'app'` | `'app'` | Controls which nav items and styles are rendered |

---

## Nav Items

### Landing variant (`variant="landing"`)

| Label | href |
|---|---|
| func(kode) | `/#func-kode` |
| How It Works | `/#how-it-works` |
| Teams & Platforms | `/#for-teams` |
| For Developers | `/#for-developers` |
| Contact Us | `/#contact-us` |

### App variant (`variant="app"`)

<!--TODO: define app nav items -->

---

## Auth State

The Navbar is auth-aware. It renders differently based on the user's session:

| State | What's shown |
|---|---|
| Logged out | `Connect` CTA → `/auth/login` |
| Logged in | GitHub username, Dashboard button, Logout button |

Auth state is retrieved via Supabase `onAuthStateChange`.

---

## GitHub Fork Count

The fork count is fetched from the GitHub API and displayed in the navbar.

**Strategy:** <!--TODO: document whether this is build-time SSG, ISR via /api/github-stats, or other -->

> ⚠️ Do NOT fetch this client-side on every page load. Unauthenticated GitHub API calls are rate-limited to 60/hr per IP.

---

## Version Badge

The version string is sourced from `process.env.NEXT_PUBLIC_APP_VERSION`.

Set this in your `.env.local`:
```
NEXT_PUBLIC_APP_VERSION=2026.5.4
```

In CI/CD, this is injected automatically from `package.json` version.

---

## Mobile Menu

- Triggered by hamburger button (visible below `xl` breakpoint)
- Slide-in drawer from the right, `w-[min(100%,320px)]`
- Backdrop click closes menu
- `Escape` key closes menu
- `aria-expanded`, `aria-controls`, `aria-label` on trigger button
- `document.body.overflow = 'hidden'` while open to prevent background scroll
