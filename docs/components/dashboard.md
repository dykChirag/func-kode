# Dashboard Layout & Sidebar

> **Status:** ✅ Implemented — commit `b009444` (scaling fix & unused variables cleanup)

---

## Overview

The `/dashboard` route uses a custom responsive layout shell instead of the global top `Navbar` and `Footer`. It features a Figma-exact sidebar navigation, a floating collapse trigger, a custom SVG gradient background, and a fluid scaling engine to fit different viewports.

---

## Layout Architecture

```text
app/dashboard/page.tsx (Dashboard Shell)
  ├── Scaling Container       ← transform scale, transform-origin: top left
  │     ├── Background SVG    ← absolute inset-0, z-0, custom filters and gradients
  │     ├── Sidebar (Aside)   ← absolute left-10 top-10, w-264, z-20
  │     │     ├── Logo
  │     │     ├── Navigation (Main, Community, Profile)
  │     │     ├── Logout Button
  │     │     └── Need Help Card
  │     ├── Toggle Button     ← absolute z-21, follows sidebar edge
  │     └── Main Content      ← margin-left adjusted by sidebar state
```

---

## 1. Background Layer

The dashboard background combines CSS gradients and embedded SVG vectors to match the Figma spec:
*   **Base Gradient**: `linear-gradient(180deg, #6325B0 0%, #0D1527 78%)`
*   **Teal Glowing Arc**: Rendered as a sharp path (`stroke="#00C9B7"`) with multiple overlapping feGaussianBlur filters to create a neon glow effect.
*   **Accent Waves**: Multiple thin, semi-transparent teal wave lines (`stroke="#00C9B7" strokeOpacity="0.5"`) layered to provide a modern, high-tech background pattern.

---

## 2. Sidemenu (Sidebar)

The sidebar is built with a glassmorphism theme and custom absolute coordinates:
*   **Dimensions**: Width is `264px` and height is `1135px`. It is spaced `10px` away from the top and left edges of the viewport container.
*   **Glassmorphism**: Uses a custom gradient background overlay with a `backdrop-filter: blur(60px)`.
*   **Collapsible State**: 
    *   Toggled by a floating hamburger menu button.
    *   Slides completely off-screen (`transform: translateX(-290px)`) when closed.
    *   Transitions the `<main>` content container's left margin (`margin-left 0.25s ease`) between `284px` (open) and `80px` (collapsed).
*   **Navigation Links**: Configured via the `<NavItem />` subcomponent, using custom-styled action icons (`IcHome`, `IcCompass`, `IcBriefcase`, etc.).
*   **Logout Area**: A custom purple-to-pink gradient button at the bottom of the sidebar.
*   **Need Help Card**: A card overlay positioned at the bottom of the sidebar with real text layers positioned absolutely over vector asset overlays.

---

## 3. Viewport Scaling & Scrollbar Logic

To match the design system across all standard screen sizes, the layout uses a client-side scale calculation:
*   **Origin**: scaled around `transformOrigin: "top left"`.
*   **Formula**: `scale = Math.min(1, viewportWidth / 1920)`. Capped at a maximum scale of `1` so it doesn't stretch disproportionately on ultra-wide screens, leaving a solid `#0D1527` background gap on the right.
*   **Scrollbar Correction**: To prevent right-edge clipping on viewports containing a vertical scrollbar, the layout uses `document.documentElement.clientWidth` instead of `window.innerWidth`.
    *   *Why*: `window.innerWidth` includes the scrollbar track width. Calculating scale with it makes the page slightly wider than the available visible screen, cutting off the rightmost content padding. Utilizing `clientWidth` guarantees it scales to fit the exact visible width.

---

## Usage

```tsx
// app/dashboard/page.tsx
export default function DashboardPage() {
  const [open, setOpen] = useState(true);
  const [scale, setScale] = useState(() =>
    typeof window !== "undefined" ? Math.min(1, document.documentElement.clientWidth / 1920) : 1
  );

  // Re-calculates on resize
  useLayoutEffect(() => {
    const update = () => {
      setScale(Math.min(1, document.documentElement.clientWidth / 1920));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <div style={{ width: "100%", overflow: "hidden", background: "#0D1527" }}>
      <div style={{ width: 1920, transform: `scale(${scale})`, transformOrigin: "top left" }}>
        <aside>...</aside>
        <main>...</main>
      </div>
    </div>
  );
}
```

---

## Related Files

| File | Role |
|---|---|
| `app/dashboard/page.tsx` | Dashboard shell layout, sidebar content, and viewport scaling |
| `components/site-chrome.tsx` | Route wrapper (skips global navbar/footer for `/dashboard` route) |
| `app/globals.css` | Custom scrollbar sizing and generic global variables |
