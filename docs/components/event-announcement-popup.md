# EventAnnouncementPopup Component

> **Status:** ✅ Implemented — issue [#103](https://github.com/patchid/func-kode/issues/103)

---

## Overview

`EventAnnouncementPopup` is a dismissible modal that appears on the landing page after a short delay to promote upcoming community events. It is config-driven so future events only need a new config object — no component changes required.

Built on `@radix-ui/react-dialog` for accessible focus trapping, scroll locking, and keyboard (Escape) dismissal.

---

## Usage

```tsx
// app/page.tsx
import { EventAnnouncementPopup } from "@/components/landing/event-announcement-popup";

// Default config (Server Launch Party)
<EventAnnouncementPopup />

// Custom event
<EventAnnouncementPopup config={{
  eventName: "🛠️ Hackathon Kickoff",
  eventDate: "Saturday 15 Feb, 7:00 PM IST",
  eventDateIso: "2025-02-15T19:00:00+05:30",
  eventDescription: "Join our first 48-hour hackathon...",
  ctaHref: "https://discord.gg/nnkA8xJ3JU",
  ctaLabel: "Join Now 🚀",
}} />
```

---

## Config Reference (`EventAnnouncementConfig`)

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `enabled` | `boolean` | Yes | `true` | Set `false` to hide without removing code |
| `eventName` | `string` | Yes | `"🎉 Server Launch Party"` | Displayed as the modal title |
| `eventDate` | `string` | Yes | `"Sunday — time TBD (IST)"` | Human-readable date string shown below title |
| `eventDateIso` | `string \| undefined` | No | `undefined` | ISO 8601 date — popup auto-disables after this datetime |
| `eventDescription` | `string` | Yes | See default | 1–2 line description shown in body |
| `ctaLabel` | `string` | Yes | `"Join the Party 🚀"` | Primary CTA button text |
| `ctaHref` | `string` | Yes | Discord invite | URL for primary CTA |
| `secondaryLabel` | `string` | No | `"Maybe Later"` | Dismiss button text |
| `delayMs` | `number` | Yes | `1500` | Milliseconds before popup appears on page load |

---

## Dismissal Behaviour

- Dismissed by: close button (×), `Maybe Later` button, primary CTA click, backdrop click, or Escape key
- After dismissal: `sessionStorage` key `funkode_event_announcement_dismissed` is set to `"true"`
- Does not reappear for the duration of the browser session
- sessionStorage access is wrapped in try/catch — fails open (shows popup) if storage is inaccessible (sandboxed iframes, SSR)

---

## Auto-Expiry

Set `eventDateIso` to automatically disable the popup after the event passes:

```ts
const MY_EVENT_CONFIG: Partial<EventAnnouncementConfig> = {
  eventDateIso: "2025-03-02T21:00:00+05:30", // popup disabled after this
};
```

If `eventDateIso` is not set, the popup stays active until `enabled` is manually set to `false`.

**TODO before going live:** Fill in `eventDateIso` with the actual event end datetime and set `enabled: false` after the event passes.

---

## Feature Flag

Disable without touching JSX:

```ts
// In DEFAULT_CONFIG or via prop override
enabled: false
```

The component renders `null` immediately — no DOM output, no delay timer.

---

## Accessibility

| Feature | Implementation |
|---|---|
| Focus trap | `@radix-ui/react-dialog` — Tab stays within modal while open |
| Scroll lock | `@radix-ui/react-dialog` — body scroll locked while modal open |
| Escape key | `@radix-ui/react-dialog` — closes modal |
| Focus restoration | `@radix-ui/react-dialog` — focus returns to trigger element on close |
| Close button touch target | `min-w-[44px] min-h-[44px]` — WCAG 2.5.5 compliant |
| Screen reader label | `Dialog.Title` announces event name; `Dialog.Description` announces body |

---

## Design System

All styles use existing project tokens — no custom colors:

| Element | Classes |
|---|---|
| Header gradient | `bg-gradient-to-br from-primary/10 via-primary/5 to-transparent` |
| Icon background | `bg-gradient-to-br from-primary to-primary/70` |
| Primary CTA | `bg-primary text-primary-foreground hover:opacity-90` |
| Secondary CTA | `border border-border bg-background hover:bg-muted` |
| Overlay | `bg-black/40 backdrop-blur-sm` |
| Card | `bg-card border border-border/50 rounded-2xl shadow-2xl` |

---

## Responsive Behaviour

| Breakpoint | Behaviour |
|---|---|
| `< 640px` | Full-width modal (capped `max-w-md`), CTAs stack vertically |
| `>= 640px` | CTAs in a row (`sm:flex-row`) |
| All sizes | Centered via `left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2` |

---

## Reusing for Future Events

1. Update `DEFAULT_CONFIG` in `event-announcement-popup.tsx` with new event details
2. Set `eventDateIso` to auto-disable after the event
3. Deploy — no component restructuring needed
4. After event: set `enabled: false` or wait for `eventDateIso` auto-expiry

---

## Related

- Issue [#103](https://github.com/patchid/func-kode/issues/103) — this PR
- Supersedes PR [#104](https://github.com/patchid/func-kode/pulls/104)
- [`components/landing/event-announcement-popup.tsx`](../../components/landing/event-announcement-popup.tsx)