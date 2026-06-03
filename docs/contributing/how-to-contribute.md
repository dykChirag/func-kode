# How to Contribute

This guide covers the local setup and required environment variables for func(Kode) contributors.

## Environment Variables

Add the following values to your local `.env.local` file:

| Variable | Purpose | Example |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL used by the client and server helpers | `https://your-project.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public Supabase anon key for browser auth flows | `eyJhbGciOi...` |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL for redirects and metadata | `http://localhost:3000` |
| `NEXT_PUBLIC_POSTHOG_KEY` | PostHog project API key for client analytics and server OTLP logs | `phc_xxxxxxxxxxxxxxxxxxxx` |
| `NEXT_PUBLIC_POSTHOG_HOST` | PostHog API host for self-hosted or cloud deployments | `https://app.posthog.com` |
| `POSTHOG_OTLP_LOGS_URL` | Optional override for OTLP log ingest (defaults from host: US/EU) | `https://eu.i.posthog.com/otlp/v1/logs` |
| `POSTHOG_SERVICE_NAME` | Service name attached to OpenTelemetry log records | `funckode` |

PostHog client analytics and server OTLP logs are disabled automatically in development, so no events or logs are sent while you work on the app.

### Server logs (OpenTelemetry)

`instrumentation.ts` registers an OTLP log exporter to PostHog on the Node.js runtime. Emit logs from API routes or server code with:

```ts
import { emitPosthogLog } from "@/lib/posthog-server-logger";

emitPosthogLog({
  body: "API route called",
  attributes: { route: "/api/example" },
});
```

## Local Setup

1. Install dependencies with `npm install`.
2. Copy the required environment variables into `.env.local`.
3. Run `npm run dev` to start the app.