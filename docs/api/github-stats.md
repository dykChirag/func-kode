# API Route: /api/github-stats

> **Status:** 🚧 Template — fill in as part of issue #94

---

## Purpose

Provides cached GitHub repository stats (fork count, star count) to the Navbar and any other UI that needs them — without making unauthenticated client-side calls to the GitHub API on every page load.

> ⚠️ Unauthenticated GitHub API calls are rate-limited to **60 requests/hour per IP**. This route caches the response server-side to avoid hitting that limit.

---

## Endpoint

```
GET /api/github-stats
```

### Response

```json
{
  "forks": 42,
  "stars": 128,
  "repo": "patchid/func-kode"
}
```

---

## Caching Strategy

<!--TODO: document the chosen approach -->

**Option A — Next.js Route Handler with ISR (recommended):**
```ts
// app/api/github-stats/route.ts
export const revalidate = 3600; // re-fetch from GitHub every 1 hour

export async function GET() {
  const res = await fetch('https://api.github.com/repos/patchid/func-kode', {
    headers: { Accept: 'application/vnd.github+json' },
    next: { revalidate: 3600 },
  });
  const data = await res.json();
  return Response.json({ forks: data.forks_count, stars: data.stargazers_count });
}
```

**Option B — Build-time static props (for Navbar in a server component):**
```ts
// Fetch once at build time, baked into the page HTML
const stats = await fetch('https://api.github.com/repos/patchid/func-kode').then(r => r.json());
```

---

## Usage in Navbar

<!--TODO: document once #94 is implemented -->

```tsx
// The Navbar receives forkCount as a prop from its server component parent
// It does NOT fetch this itself client-side
<Navbar forkCount={stats.forks} />
```
