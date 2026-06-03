# SiteChrome — Global Layout Wrapper

> **Status:** ✅ Implemented — issue [#93](https://github.com/patchid/func-kode/issues/93)

---

## What Is It?

`SiteChrome` (`components/site-chrome.tsx`) is a **client component** that wraps all page content in `app/layout.tsx`. It reads the current route with `usePathname()` and decides whether to render the shared `<Navbar>` and `<Footer>` around `{children}`.

```text
app/layout.tsx (Server Component)
  └── <Providers>
        └── <SiteChrome>          ← client, route-aware
              ├── "/"             → children only (no global chrome)
              └── other routes    → Navbar + main + Footer
```

---

## Why Does It Exist?

### The problem

The landing page rebuild (EPIC [#92](https://github.com/patchid/func-kode/issues/92)) gives `/` its **own** navbar and footer inside a dedicated landing layout (`LandingPageContent`). The rest of the app (`/dashboard`, `/projects`, `/blog`, etc.) must keep the **existing** global `<Navbar>` and `<Footer>`.

Before `SiteChrome`, both were wired directly in `app/layout.tsx`:

```tsx
<div className="min-h-screen flex flex-col">
  <Navbar />
  <main className="flex-1">{children}</main>
  <Footer />
</div>
```

That works for every route **except** `/`, where the global chrome would **stack on top of** the landing-specific chrome (double navbar, double footer).

### Why `layout.tsx` alone is not enough

`app/layout.tsx` is a **Server Component**. It does not have access to the active pathname without either:

1. Passing route information from a child client boundary, or  
2. Splitting layouts with nested `app/(marketing)/layout.tsx` route groups (a larger refactor).

`SiteChrome` is the minimal client boundary that:

- Keeps **one** root layout for metadata, fonts, and providers  
- Centralizes the “show global chrome or not” rule in **one file**  
- Avoids copying `<Navbar />` + `<Footer />` into dozens of page files  

### Alternatives considered

| Approach | Why we did not use it (for this PR) |
|---|---|
| Duplicate Navbar/Footer on every non-landing page | High maintenance; easy to miss on new routes |
| `if (pathname)` logic inside `layout.tsx` | Root layout cannot call `usePathname()` without a client child |
| Route groups only (`(app)` / `(marketing)`) | Valid long-term; larger blast radius than issue #93 scope |
| Landing page hides chrome with CSS | Still mounts auth/nav logic; hurts performance and a11y |

### Blast radius (why this is its own PR)

`SiteChrome` affects **every route** in the app, not only the landing page. A reviewer needs to confirm:

- Non-landing routes still get Navbar + Footer unchanged  
- `/` no longer receives global chrome (landing PRs will supply their own)  
- Providers and `DebugConsoleProvider` order in `layout.tsx` stay the same  

That is why this change was split out of [PR #91](https://github.com/patchid/func-kode/pull/91) and must merge **before** navbar, background, or hero landing PRs.

---

## Usage

```tsx
// app/layout.tsx
import { SiteChrome } from "@/components/site-chrome";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <SiteChrome>{children}</SiteChrome>
        </Providers>
      </body>
    </html>
  );
}
```

`SiteChrome` must stay **inside** `Providers` so any future chrome that depends on context (theme, auth) still works.

---

## Route Behaviour

| Route | Global Navbar | Global Footer | Notes |
|---|---|---|---|
| `/` | ❌ | ❌ | Landing chrome comes from later PRs (`LandingPageContent`) |
| `/dashboard`, `/projects`, `/blog`, … | ✅ | ✅ | Same shell as before this PR |
| `/auth/login`, `/onboard`, … | ✅ | ✅ | Unchanged |

---

## Adding New Route Exceptions

If another page must opt out of global chrome, extend the check in `components/site-chrome.tsx`:

```tsx
const CHROMELESS_PATHS = ["/", "/preview-landing"] as const;

const isChromeless = CHROMELESS_PATHS.includes(
  pathname as (typeof CHROMELESS_PATHS)[number]
);
```

Prefer a small constant array over scattered `pathname ===` checks. If exceptions grow beyond 2–3 routes, consider a route-group layout instead.

---

## Manual Verification

After changing `SiteChrome` or `layout.tsx`, verify:

1. **`/`** — no global Navbar or Footer in the DOM (view source or DevTools).  
2. **`/dashboard`** — Navbar + Footer visible; auth controls still work.  
3. **`/projects`** — same as dashboard.  
4. **`/blog`** (or any content route) — same chrome as before.  
5. **Client navigation** — navigate `/dashboard` → `/` → `/dashboard`; chrome should appear/disappear without a full reload.

---

## Related Work

| Item | Relationship |
|---|---|
| EPIC [#92](https://github.com/patchid/func-kode/issues/92) | Landing rebuild; depends on this PR merging first |
| Issue [#94](https://github.com/patchid/func-kode/issues/94) | Navbar rewrite — must not change `SiteChrome` behaviour |
| Issue [#96](https://github.com/patchid/func-kode/issues/96) | `LandingBackground` — only rendered on `/` |
| Issue [#97](https://github.com/patchid/func-kode/issues/97) | `HeroSection` + `page.tsx` wiring |

---

## Files

| File | Role |
|---|---|
| `components/site-chrome.tsx` | Route-aware chrome wrapper |
| `app/layout.tsx` | Root layout; delegates chrome to `SiteChrome` |
| `components/navbar.tsx` | Unchanged in this PR — still used by `SiteChrome` on non-landing routes |
| `components/footer.tsx` | Unchanged in this PR |
