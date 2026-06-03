# SiteChrome — Global Layout Wrapper

> **Status:** 🚧 Template — fill in as part of issue #93

---

## What Is It?

`SiteChrome` is a client component that wraps all page content in `app/layout.tsx`. It conditionally renders the global `<Navbar>` and `<Footer>` based on the current route.

---

## Why Does It Exist?

<!--TODO: explain the motivation -->

The landing page (`/`) has its own self-contained layout with a custom Navbar embedded inside `LandingPageContent`. It does not use the global Navbar/Footer. All other routes (`/dashboard`, `/projects`, etc.) do.

Without `SiteChrome`, the only way to suppress the global Navbar on the landing page would be to move Navbar/Footer out of `layout.tsx` and into every other page individually — which is not maintainable.

---

## Usage

```tsx
// app/layout.tsx
import { SiteChrome } from "@/components/site-chrome";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
```

---

## Route Behaviour

| Route | Navbar shown | Footer shown |
|---|---|---|
| `/` (landing) | ❌ (handled by `LandingPageContent`) | ❌ |
| All other routes | ✅ | ✅ |

---

## Adding New Route Exceptions

If a new page needs to opt out of the global chrome, add it to the `isLandingPage` check:

```tsx
// components/site-chrome.tsx
const isChromeless = pathname === "/" || pathname === "/some-other-page";
```

<!--TODO: refactor to a config array if exceptions grow beyond 2-3 routes -->
