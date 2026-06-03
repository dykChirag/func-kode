# SiteChrome — Global Layout Wrapper

> **Status:** ✅ Implemented — issue [#93](https://github.com/patchid/func-kode/issues/93), updated in [#94](https://github.com/patchid/func-kode/issues/94)

---

## What Is It?

`SiteChrome` (`components/site-chrome.tsx`) is a **client component** that wraps all page content in `app/layout.tsx`. It renders the global `<Navbar>` on every route and conditionally renders `<Footer>` on non-landing routes.

```text
app/layout.tsx (Server Component)
  └── getGitHubStats()
        └── <SiteChrome forkCount={forks}>
              ├── <Navbar forkCount={forks}>   ← every route
              ├── <main>{children}</main>
              └── <Footer />                   ← all routes except /
```

---

## Why Does It Exist?

### The problem

The root layout is a **Server Component** and cannot call `usePathname()`. `SiteChrome` is the minimal client boundary that:

- Keeps **one** root layout for metadata, fonts, and providers
- Centralizes route-aware chrome rules in **one file**
- Passes server-fetched props (e.g. `forkCount`) into client components

### Blast radius

`SiteChrome` affects **every route** in the app. Reviewers should confirm:

- Navbar renders on all routes including `/`
- Footer is omitted on `/` (landing page will supply its own footer in a later PR)
- `forkCount` from the layout reaches the Navbar without client-side GitHub API calls

---

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `React.ReactNode` | — | Page content |
| `forkCount` | `number \| null` | `null` | GitHub fork count from `app/layout.tsx` |

---

## Usage

```tsx
// app/layout.tsx
import { getGitHubStats } from "@/lib/github-stats";
import { SiteChrome } from "@/components/site-chrome";

export default async function RootLayout({ children }) {
  const { forks: forkCount } = await getGitHubStats();

  return (
    <html lang="en">
      <body>
        <Providers>
          <SiteChrome forkCount={forkCount}>{children}</SiteChrome>
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
| `/` | ✅ | ❌ | Landing footer comes from a later PR |
| `/dashboard`, `/projects`, `/blog`, … | ✅ | ✅ | Same shell as before |
| `/auth/login`, `/onboard`, … | ✅ | ✅ | Unchanged |

---

## Manual Verification

After changing `SiteChrome` or `layout.tsx`, verify:

1. **`/`** — Navbar visible; no global Footer in the DOM.
2. **`/dashboard`** — Navbar + Footer visible; auth controls work.
3. **Network tab** — no client-side calls to `api.github.com` on page load.
4. **Client navigation** — navigate `/dashboard` → `/` → `/dashboard`; Navbar persists; Footer appears/disappears.

---

## Related Work

| Item | Relationship |
|---|---|
| EPIC [#92](https://github.com/patchid/func-kode/issues/92) | Landing rebuild |
| Issue [#94](https://github.com/patchid/func-kode/issues/94) | Navbar rewrite — passes `forkCount`, renders Navbar on `/` |
| Issue [#96](https://github.com/patchid/func-kode/issues/96) | `LandingBackground` — only rendered on `/` |
| Issue [#97](https://github.com/patchid/func-kode/issues/97) | `HeroSection` + `page.tsx` wiring |

---

## Files

| File | Role |
|---|---|
| `components/site-chrome.tsx` | Route-aware chrome wrapper |
| `app/layout.tsx` | Root layout; fetches stats, delegates chrome to `SiteChrome` |
| `components/navbar.tsx` | Global navbar — see [`navbar.md`](../components/navbar.md) |
| `components/footer.tsx` | Global footer (non-landing routes) |
