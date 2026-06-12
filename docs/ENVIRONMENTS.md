# 🌍 Environment Setup Guide

> This document explains how func(kode) handles **three environments** — Local, Staging, and Production — and what each person on the team (internal maintainer, intern, or open-source contributor) needs to do to get set up correctly.

---

## ⚡ TL;DR

| Environment | Who uses it | Supabase | GitHub OAuth App |
|---|---|---|---|
| **Local** | Everyone (contributors, interns, maintainers) | `localhost:54321` via Supabase CLI | Your own personal OAuth App |
| **Staging** | Internal team only (maintainers + interns) | Shared `patchid-dev` Supabase project | Shared staging OAuth App |
| **Production** | Founder + Founding Engineer only | `patchid-prod` Supabase project | Real OAuth App on prod domain |

> ⚠️ **If you are an open-source contributor, you only ever need the Local setup. Stop at Section 1.**

---

## 📋 Prerequisites (all environments)

Before anything, make sure you have these installed:

- [Node.js 18+](https://nodejs.org/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) — **required** for local Supabase
- [Supabase CLI](https://supabase.com/docs/guides/cli) — install via:

```bash
npm install -g supabase
```

- [Git](https://git-scm.com/)

---

## 1. 🖥️ Local Environment

> **For:** Open-source contributors, interns, and internal team members for day-to-day development.
> **Rule:** Your local environment is fully isolated. Nothing you do here affects staging or production.

### Step 1 — Fork and clone the repo

```bash
# Fork the repo on GitHub first, then:
git clone https://github.com/YOUR_USERNAME/func-kode.git
cd func-kode

# Always branch from dev, never from main
git checkout dev
git checkout -b feat/your-feature-name
```

### Step 2 — Install dependencies

```bash
npm install
```

### Step 3 — Copy the environment file

```bash
cp .env.example .env.local
```

### Step 4 — Start the local Supabase stack

Make sure Docker Desktop is running, then:

```bash
supabase start
```

This will spin up a full local Supabase instance (Postgres, Auth, Storage, API) on your machine.
Once it's done, it will print something like this:

```
API URL:          http://localhost:54321
GraphQL URL:      http://localhost:54321/graphql/v1
DB URL:           postgresql://postgres:postgres@localhost:54321/postgres
Studio URL:       http://localhost:54323
anon key:         eyJh...
service_role key: eyJh...
```

Copy the `anon key` and `service_role key` into your `.env.local`.

### Step 5 — Apply the database schema

```bash
# This applies database/schema.sql and database/profiles.sql to your local DB
supabase db reset
```

> 💡 Run `supabase db reset` every time the schema changes (when you pull new changes that include database updates).

### Step 6 — Create your own GitHub OAuth App

Each person needs their own GitHub OAuth App for local development because the callback URL is `localhost`, not the production domain.

1. Go to [github.com/settings/developers](https://github.com/settings/developers)
2. Click **New OAuth App**
3. Fill in:
   - **Application name:** `func-kode local (your name)`
   - **Homepage URL:** `http://localhost:3000`
   - **Authorization callback URL:** `http://localhost:3000/auth/callback`
4. Click **Register application**
5. Copy the **Client ID** and generate a **Client Secret**
6. Paste them into your `.env.local`:

```bash
GITHUB_CLIENT_ID=your-client-id-here
GITHUB_CLIENT_SECRET=your-client-secret-here
```

### Step 7 — Final `.env.local` should look like this

```bash
# Supabase local — from `supabase start` output
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-local-anon-key
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-local-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-local-service-role-key

# App
NEXT_PUBLIC_SITE_URL=http://localhost:3000
SITE_URL=http://localhost:3000
API_EXTERNAL_URL=http://localhost:54321

# Local Supabase internal settings
POSTGRES_PASSWORD=postgres
AUTH_JWT_SECRET=super-secret-jwt-token-with-at-least-32-characters-long

# GitHub OAuth — your personal OAuth App
GITHUB_ENABLED=true
GITHUB_CLIENT_ID=your-github-oauth-app-client-id
GITHUB_CLIENT_SECRET=your-github-oauth-app-client-secret

# PostHog — leave disabled locally unless you are testing analytics
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
NEXT_PUBLIC_POSTHOG_ENABLED=false
```

### Step 8 — Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you're running func(kode) locally. ✅

### Stopping and restarting local Supabase

```bash
# Stop
supabase stop

# Start again
supabase start

# Reset DB to clean state (wipes all local data and re-runs schema)
supabase db reset
```

---

## 2. 🧪 Staging Environment

> **For:** Internal team only — maintainers and interns.
> **Rule:** Use staging to test features before they go live. Only test data here. Never real user data.
> **Access:** You will be invited to the `patchid-dev` Supabase project. Ask the founder/lead maintainer for an invite.

### Getting access

1. The project lead will invite you to the `patchid-dev` Supabase project via your email through the Supabase Dashboard → Project Settings → Team.
2. You will receive a **staging `.env` file** shared via the team's secure channel (1Password / Notion private page). **Never share these keys publicly or commit them to git.**

### Your staging `.env.local` will look like this

```bash
# Supabase staging — from the shared team credentials
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=staging-anon-key
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=staging-anon-key
SUPABASE_SERVICE_ROLE_KEY=staging-service-role-key   # ⚠️ never commit this

# App
NEXT_PUBLIC_SITE_URL=https://staging.func-kode.dev
SITE_URL=https://staging.func-kode.dev

# GitHub OAuth — shared staging OAuth App (from team credentials)
GITHUB_ENABLED=true
GITHUB_CLIENT_ID=staging-github-client-id
GITHUB_CLIENT_SECRET=staging-github-client-secret

# PostHog — shared staging project key (from team credentials)
NEXT_PUBLIC_POSTHOG_KEY=staging-posthog-key
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
NEXT_PUBLIC_POSTHOG_ENABLED=true
```

### Keeping staging schema in sync

When the schema changes, the project lead will push updated migrations to staging:

```bash
# Run by project lead only — pushes local migrations to the staging project
supabase db push --project-ref <staging-project-ref>
```

As a team member, you don't need to do this yourself — just pull the latest `dev` branch and your local environment stays in sync via `supabase db reset`.

### Staging rules

- ✅ Use staging for testing features end-to-end before opening a PR to `main`
- ✅ Use staging to verify GitHub OAuth flows with a real hosted URL
- ✅ Use staging to test PostHog analytics events
- ❌ Do not use real personal accounts or real GitHub data for testing
- ❌ Do not run destructive queries (`DROP TABLE`, `TRUNCATE`) without asking the team first
- ❌ Do not share staging keys with anyone outside the internal team

---

## 3. 🚀 Production Environment

> **For:** Founder and Founding Engineer only.
> **Rule:** Nobody else ever has access to production keys or the production Supabase project. No exceptions.

### What production looks like

- Supabase project: `patchid-prod` (hosted on Supabase cloud)
- GitHub OAuth App: registered against the real production domain
- PostHog: real production project with live user analytics
- Deployed via Vercel Production environment

### Where production keys live

Production keys are **never shared in chat, documents, or with any team member**. They live only in:

- **Vercel** → Project Settings → Environment Variables (Production only)
- **GitHub Actions** → Repository Secrets (for CI/CD pipelines)
- **Secure password manager** → Accessible only to the founder and founding engineer

### How production deployments work

Production is deployed automatically when changes are merged to `main` via Vercel. The flow is:

```
feature branch → PR to dev → reviewed + merged to dev
                                        ↓
                              tested on staging
                                        ↓
                          PR from dev → main (project lead only)
                                        ↓
                       Vercel auto-deploys to production ✅
```

Nobody pushes directly to `main`. All production changes go through `dev` → reviewed → staging tested → `main`.

### If you think you need production access

You don't. If you are debugging a production issue:
1. Describe the issue to the project lead
2. The project lead checks production directly
3. Fixes are developed locally → staged → deployed through the normal flow

---

## 🔑 Key Rules (for everyone)

These apply regardless of which environment you are in:

1. **Never commit `.env.local` or any `.env` file to git.** The `.gitignore` already blocks this — don't override it.
2. **Never paste keys in Slack, Discord, GitHub issues, or PR comments.** Ever.
3. **Never use production keys locally.** If your local app is pointing at the real `patchid-prod` Supabase URL, stop immediately and switch to local or staging.
4. **If you accidentally expose a key**, tell the project lead immediately. Keys can be rotated. Silence cannot be undone.
5. **PostHog is disabled locally by default.** Keep `NEXT_PUBLIC_POSTHOG_ENABLED=false` in your `.env.local` unless you are specifically testing analytics.

---

## 🆘 Common Problems

### `supabase start` fails
- Make sure **Docker Desktop is running** before running `supabase start`
- If you get a port conflict, run `supabase stop` first then `supabase start` again

### GitHub OAuth not working locally
- Double-check the callback URL in your GitHub OAuth App settings is exactly `http://localhost:3000/auth/callback`
- Make sure `GITHUB_ENABLED=true` is set in `.env.local`
- Make sure you're using your **own** OAuth App, not a shared one

### Schema is out of date after pulling
```bash
supabase db reset
```
This re-applies `database/schema.sql` and `database/profiles.sql` from scratch. Safe to run — it only affects your local database.

### `supabase` command not found
```bash
npm install -g supabase
```

### Can't find the local Supabase keys
```bash
supabase status
```
This prints all your local keys, URLs, and ports at any time.

---

## 📁 Related files

- [`.env.example`](../.env.example) — template for your `.env.local`
- [`database/schema.sql`](../database/schema.sql) — full database schema
- [`database/profiles.sql`](../database/profiles.sql) — profiles table definition
- [`CONTRIBUTING.md`](../CONTRIBUTING.md) — how to contribute code and open PRs
- [`SECURITY.md`](../SECURITY.md) — how to report security vulnerabilities

---

> Built with ❤️ by the func(kode) team. If something in this doc is wrong or outdated, open a PR against `dev` with the fix — docs contributions are very welcome.
