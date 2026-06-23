/**
 * lib/landing-config.ts
 *
 * Single source of truth for landing page configurable values.
 * Update this file to change event announcements, Discord links, or
 * any other landing page copy that varies per launch/season.
 *
 * Issue #130 — Event Announcement Popup config
 */

// ── Discord ────────────────────────────────────────────────────────────────────

/**
 * Official func(kode) Discord invite URL.
 * Used by: EventAnnouncementPopup, Footer Discord link, Navbar Discord link.
 * Update this if the invite link changes — one place, all surfaces.
 */
export const DISCORD_INVITE_URL = "https://discord.gg/nnkA8xJ3JU";

// ── GitHub ─────────────────────────────────────────────────────────────────────

export const GITHUB_REPO_URL = "https://github.com/patchid/func-kode";

// ── Event Announcement Popup ───────────────────────────────────────────────────

/**
 * Config for the EventAnnouncementPopup component.
 *
 * Fields:
 *   enabled      — set false to hide the popup without removing code
 *   eventName    — display title (shown in Dialog.Title)
 *   eventDate    — human-readable date string shown under the title
 *   eventDateIso — ISO 8601 datetime; popup auto-hides after this passes
 *   eventDescription — body copy
 *   ctaLabel     — primary button label
 *   ctaHref      — primary button destination (Discord, Luma, etc.)
 *   secondaryLabel — dismiss button label
 *   delayMs      — how long after page load before popup appears
 *
 * To update for the next event:
 *   1. Change eventName, eventDate, eventDateIso, ctaHref
 *   2. Set enabled: true
 *   3. After event passes, set enabled: false (or update eventDateIso)
 */
export const ANNOUNCEMENT_EVENT = {
  enabled: true,
  eventName: "\uD83C\uDF89 Server Launch Party",
  eventDate: "Saturday, 13 June 2026 \u2014 11:00 AM IST",
  // Popup auto-hides after this ISO datetime (11am start + 75min buffer)
  eventDateIso: "2026-06-13T12:30:00+05:30",
  eventDescription:
    "Join the func-kode Launch Party to kick off the community, meet other developers, explore the server, and hear what\u2019s coming next.",
  ctaLabel: "Join the Party \uD83D\uDE80",
  ctaHref: DISCORD_INVITE_URL,
  secondaryLabel: "Maybe Later",
  delayMs: 1500,
} as const;
