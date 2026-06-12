# Analytics (PostHog)

Product analytics for func(Kode) using [PostHog](https://posthog.com). All custom events must use constants from `ANALYTICS_EVENTS` in `lib/analytics/events.ts` and the `track()` helper in `lib/analytics/index.ts` — never pass raw strings to `posthog.capture()`.

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_POSTHOG_KEY` | Yes (when analytics enabled) | PostHog project API key |
| `NEXT_PUBLIC_POSTHOG_HOST` | No | PostHog ingest host (default: `https://eu.i.posthog.com` for EU cloud) |

Add these to `.env.local` (never commit real keys). See `.env.example`.

PostHog is **disabled during `npm run dev`** unless you set `NEXT_PUBLIC_POSTHOG_ENABLED=true`. Setting `NODE_ENV` in `.env.local` does not change this — Next.js always uses `development` in the dev server.

Leave `NEXT_PUBLIC_POSTHOG_KEY` empty (and omit `NEXT_PUBLIC_POSTHOG_ENABLED`) for normal local work. To verify events locally, set both the key and `NEXT_PUBLIC_POSTHOG_ENABLED=true`, then restart the dev server.

Set `NEXT_PUBLIC_POSTHOG_HOST` to the **ingest** URL for your region: `https://eu.i.posthog.com` (EU) or `https://us.i.posthog.com` (US). The app UI URL (`eu.posthog.com`) is not the ingest host — a region mismatch silently drops events.

## Naming convention

All event names follow **`noun_verb`** in `snake_case`, past tense where the action is complete.

```
object_action

Examples:
  page_viewed          ✔
  landing_cta_clicked  ✔
  login_attempted      ✔
  project_submitted    ✔
  onboarding_completed ✔

NOT:
  clickCTA             ✗ camelCase
  CTA_CLICKED          ✗ SCREAMING_SNAKE
  user_did_click_cta   ✗ verbose
  login_attempt        ✗ present tense
```

## Usage

```ts
import { ANALYTICS_EVENTS, track } from "@/lib/analytics";

track(ANALYTICS_EVENTS.LOGIN_ATTEMPTED, { method: "github" });
```

PostHog is bootstrapped in `components/providers/posthog-provider.tsx` with `persistence: "memory"` and manual `$pageview` capture via `components/providers/posthog-pageview.tsx`.

## Event catalogue

| Constant | Event name | Area |
|----------|------------|------|
| `PAGE_VIEWED` | `page_viewed` | Page |
| `LANDING_CTA_CLICKED` | `landing_cta_clicked` | Landing |
| `LANDING_SECTION_VIEWED` | `landing_section_viewed` | Landing |
| `GITHUB_FORK_CLICKED` | `github_fork_clicked` | Landing |
| `DISCORD_LINK_CLICKED` | `discord_link_clicked` | Landing |
| `ANNOUNCEMENT_POPUP_SHOWN` | `announcement_popup_shown` | Landing |
| `ANNOUNCEMENT_CTA_CLICKED` | `announcement_cta_clicked` | Landing |
| `ANNOUNCEMENT_DISMISSED` | `announcement_dismissed` | Landing |
| `LOGIN_ATTEMPTED` | `login_attempted` | Auth |
| `LOGIN_SUCCEEDED` | `login_succeeded` | Auth |
| `LOGIN_FAILED` | `login_failed` | Auth |
| `SIGNUP_ATTEMPTED` | `signup_attempted` | Auth |
| `SIGNUP_FAILED` | `signup_failed` | Auth |
| `LOGOUT` | `logout` | Auth |
| `ONBOARDING_STARTED` | `onboarding_started` | Auth |
| `ONBOARDING_COMPLETED` | `onboarding_completed` | Auth |
| `ONBOARDING_FAILED` | `onboarding_failed` | Auth |
| `ONBOARDING_ERROR` | `onboarding_error` | Auth |
| `ONBOARDING_SKIPPED` | `onboarding_skipped` | Auth |
| `PROJECT_SUBMIT_STARTED` | `project_submit_started` | Projects |
| `PROJECT_SUBMITTED` | `project_submitted` | Projects |
| `PROJECT_VIEWED` | `project_viewed` | Projects |
| `EVENT_VIEWED` | `event_viewed` | Events |
| `RSVP_STARTED` | `rsvp_started` | Events |
| `RSVP_SUBMITTED` | `rsvp_submitted` | Events |
| `BLOG_POST_VIEWED` | `blog_post_viewed` | Blog |
| `BLOG_LIKED` | `blog_liked` | Blog |
| `BLOG_COMMENTED` | `blog_commented` | Blog |
| `DASHBOARD_VIEWED` | `dashboard_viewed` | Dashboard |
| `DASHBOARD_ACTION_CLICKED` | `dashboard_action_clicked` | Dashboard |

Instrumented:

- `LOGIN_ATTEMPTED`, `LOGIN_FAILED` in `components/login-form.tsx`
- `LOGIN_SUCCEEDED`, `LOGIN_FAILED` (server) in `app/auth/callback/route.ts` via `lib/analytics/server.ts`
- `LOGOUT` + `posthog.reset()` in `components/logout-button.tsx`
- `ONBOARDING_STARTED` on mount in `app/onboard/page.tsx`; `ONBOARDING_COMPLETED` / `ONBOARDING_FAILED` / `ONBOARDING_ERROR` in `components/onboard-profile-form.tsx`
- PostHog identity (`posthog.identify` with `email`, `github_username`) in `components/providers/posthog-provider.tsx`
- `SIGNUP_ATTEMPTED`, `SIGNUP_FAILED` in `components/sign-up-form.tsx`
- `DASHBOARD_VIEWED`, `DASHBOARD_ACTION_CLICKED` in `app/dashboard/page.tsx`
- `PROJECT_SUBMIT_STARTED`, `PROJECT_SUBMITTED` in `app/submit-project/page.tsx`
- `EVENT_VIEWED` in `app/events/[id]/page.tsx`
- `RSVP_STARTED`, `RSVP_SUBMITTED` in `app/rsvp/page.tsx`
- `BLOG_POST_VIEWED`, `BLOG_LIKED`, `BLOG_COMMENTED` in `app/blog/[slug]/page.tsx`
- Admin pages (`app/admin/*`) are not instrumented — exclude from funnels via PostHog filters
- Landing (#111): `PAGE_VIEWED`, `LANDING_CTA_CLICKED`, `LANDING_SECTION_VIEWED`, `GITHUB_FORK_CLICKED`, `DISCORD_LINK_CLICKED`, announcement popup events in `components/landing/*` and `components/navbar.tsx`, `components/footer.tsx`
