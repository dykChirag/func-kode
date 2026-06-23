/**
 * dashboard-assets.ts
 *
 * Central registry of all /public/dashboard/ static asset paths.
 *
 * Rules:
 *   - Every key must point to a file that physically exists in /public/dashboard/.
 *   - Never import these paths directly into CSS — use in src/href attributes only.
 *   - Do not add paths for assets that do not exist yet (causes 404s in production).
 */
export const DASHBOARD_ASSETS = {
  /** Dashboard background wave lines — teal arc + blur layers (SVG). */
  bgWaves: "/dashboard/bg-dashboard-waves.svg",
} as const;

export type DashboardAssetKey = keyof typeof DASHBOARD_ASSETS;
