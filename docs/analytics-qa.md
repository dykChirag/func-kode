# PostHog analytics — E2E QA checklist (#115)

Manual validation pass for epic #108. Open **PostHog → Live Events** in a second tab while walking through each flow.

## Setup

1. Use staging/preview **or** localhost with:
   ```
   NEXT_PUBLIC_POSTHOG_KEY=phc_...
   NEXT_PUBLIC_POSTHOG_HOST=https://eu.i.posthog.com
   NEXT_PUBLIC_POSTHOG_ENABLED=true
   ```
2. Restart dev server after env changes
3. Open PostHog → **Live Events** (filter by your test `distinct_id` if needed)
4. Tick each box as you verify; attach screenshots to GitHub issue #115

---

## Automated pre-checks (run before manual QA)

```bash
# Zero raw string event names outside the track() wrapper and $pageview helper
rg "posthog\.capture\(['\"]" --glob '*.{ts,tsx}'
# Expected: only components/providers/posthog-pageview.tsx ($pageview)

npm run typecheck
```

| Check | Expected | Status |
|-------|----------|--------|
| `posthog-js` in `package.json` dependencies | present | ✓ |
| `lib/analytics/events.ts` exports `ANALYTICS_EVENTS` | present | ✓ |
| `lib/analytics/index.ts` exports `track()` | present | ✓ |
| `docs/analytics.md` event catalogue + funnels | present | ✓ |
| `capture_pageview: false` in provider | set | ✓ |
| `PostHogProvider` wraps app in `components/providers.tsx` | yes | ✓ |
| No raw `posthog.capture('event_name')` for custom events | zero | ✓ |

---

## Provider & pageview (#109)

- [ ] No `posthog is not defined` or `posthog.init is not a function` in browser console
- [ ] Navigating to `/` fires `$pageview` in Live Events
- [ ] Client-side navigation (`/` → `/blog`) fires a second `$pageview` without full reload
- [ ] `$pageview` does **not** double-fire on initial load (only one manual capture; `capture_pageview: false`)

---

## Event catalogue (#110)

- [ ] `rg "posthog\.capture\(['\"]"` shows only `$pageview` in `posthog-pageview.tsx`
- [ ] All custom events use `track(ANALYTICS_EVENTS.*)` from `lib/analytics`

---

## Landing page (#111)

- [ ] `page_viewed` on `/` with `{ page: "landing" }`
- [ ] Hero CTA ("Start Contributing") fires `landing_cta_clicked` with `{ cta_label, section: "hero" }`
- [ ] GitHub fork button fires `github_fork_clicked`
- [ ] Discord link fires `discord_link_clicked` with `{ source: "navbar" }` or `{ source: "footer" }`
- [ ] Scroll to `#how-it-works` fires `landing_section_viewed` with `{ section_id: "how-it-works" }`
- [ ] Each section fires **once** per page load (scroll up/down does not re-fire)
- [ ] Announcement popup fires `announcement_popup_shown`
- [ ] Popup CTA fires `announcement_cta_clicked`
- [ ] Close button fires `announcement_dismissed` with `{ method: "button" }`
- [ ] Backdrop click fires `announcement_dismissed` with `{ method: "backdrop" }`
- [ ] Escape key fires `announcement_dismissed` with `{ method: "escape" }`

---

## Auth flows (#112)

> **Note:** Navbar "Connect" fires `landing_cta_clicked` (`section: "navbar"`), not `login_attempted`. `login_attempted` fires when clicking **Sign in with GitHub** on `/auth/login`.

- [ ] "Sign in with GitHub" fires `login_attempted` with `{ method: "github" }`
- [ ] Completing GitHub OAuth fires `login_succeeded` attributed to Supabase `user.id` (not `anonymous`)
- [ ] PostHog **Persons** tab shows user with `{ email, github_username }`
- [ ] Visiting `/onboard` fires `onboarding_started`
- [ ] Completing onboard form fires `onboarding_completed` with `{ github_username }`
- [ ] Logout (navbar or logout button) fires `logout` **before** sign-out
- [ ] After logout, events are anonymous (`posthog.reset()` called)

---

## Dashboard & app events (#113)

- [ ] `/dashboard` fires `dashboard_viewed` once per session (not on every re-render)
- [ ] `/submit-project` fires `project_submit_started` when form loads (authenticated)
- [ ] Successful submit fires `project_submitted` with `{ project_name, has_github_url }`
- [ ] Failed submit does **not** fire `project_submitted`
- [ ] Event detail page fires `event_viewed` with `{ event_id, event_name }`
- [ ] RSVP form fires `rsvp_started` with `{ event_id }` when displayed
- [ ] Successful RSVP fires `rsvp_submitted` with `{ event_id, event_name }`
- [ ] Blog post fires `blog_post_viewed` with `{ slug, title, author }`
- [ ] Like fires `blog_liked` with `{ blog_id, slug }`
- [ ] Unlike does **not** fire `blog_liked`
- [ ] Comment fires `blog_commented` with `{ blog_id, slug }` on success only
- [ ] `/admin` and `/admin/projects` emit no custom analytics events

---

## Funnels (#114)

Configure in PostHog if not done — see [analytics.md](./analytics.md#core-funnels-114).

- [ ] Funnel 1 (Visitor → CTA → Login) shows at least one completion
- [ ] Funnel 2 (Login → Onboard → Dashboard) shows at least one completion
- [ ] Funnel 3 (Dashboard → Project Submit) shows at least one completion
- [ ] All 3 funnels pinned to **Core Funnels** dashboard

**Recommended test path for all funnels in one session:**

1. `/` → wait for `page_viewed`
2. Click hero **Start Contributing** → `landing_cta_clicked` (section: hero)
3. **Sign in with GitHub** → `login_attempted` → OAuth → `login_succeeded`
4. Complete `/onboard` → `onboarding_started` → `onboarding_completed`
5. Land on `/dashboard` → `dashboard_viewed`
6. `/submit-project` → `project_submit_started` → submit → `project_submitted`

---

## Known failure modes

| Symptom | Likely cause |
|---------|----------------|
| Events attributed to `anonymous` | `posthog.identify()` not called after login — check provider + OAuth callback |
| `$pageview` fires twice on load | `capture_pageview: true` AND manual pageview both enabled |
| Section events fire multiple times | IntersectionObserver missing `Set` guard |
| `project_submitted` on error | Event not guarded behind success response |
| `posthog.capture is not a function` | Provider not wrapping component tree |
| No events at all | Wrong key, missing `NEXT_PUBLIC_POSTHOG_ENABLED=true` in dev, or server not restarted |
| `login_succeeded` missing in Live Events | Server-side event — check `NEXT_PUBLIC_POSTHOG_KEY` is set (used by `lib/analytics/server.ts`) |

---

## Sign-off

- [ ] Every checkbox above ticked
- [ ] Screenshot of Live Events showing full auth flow attached to #115
- [ ] Screenshot of Core Funnels dashboard attached to #115
- [ ] `docs/analytics.md` dashboard link updated with PostHog URL

**Tester:** _______________  
**Date:** _______________  
**Environment:** _______________ (localhost / preview / production)
