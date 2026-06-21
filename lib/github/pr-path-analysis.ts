const TEST_PATH_PATTERNS = [
  /\/tests?\//i,
  /\/__tests__\//i,
  /\.test\.[jt]sx?$/i,
  /\.spec\.[jt]sx?$/i,
  /\/e2e\//i,
  /\/cypress\//i,
];

const DOCS_PATH_PATTERNS = [
  /^docs?\//i,
  /\/docs?\//i,
  /\.mdx?$/i,
  /^readme/i,
  /^changelog/i,
];

const RISKY_PATH_PATTERNS = [
  /\.env/i,
  /secret/i,
  /credential/i,
  /\/auth\//i,
  /\/migrations?\//i,
  /database\/schema/i,
  /supabase\/migrations/i,
  /wrangler\.(jsonc|toml)$/i,
  /package-lock\.json$/i,
  /\.github\/workflows\//i,
];

export function analyzeChangedPaths(filePaths: string[]): {
  tests_touched: boolean;
  docs_touched: boolean;
  risky_paths_hit: boolean;
} {
  let tests_touched = false;
  let docs_touched = false;
  let risky_paths_hit = false;

  for (const filePath of filePaths) {
    if (TEST_PATH_PATTERNS.some((pattern) => pattern.test(filePath))) {
      tests_touched = true;
    }
    if (DOCS_PATH_PATTERNS.some((pattern) => pattern.test(filePath))) {
      docs_touched = true;
    }
    if (RISKY_PATH_PATTERNS.some((pattern) => pattern.test(filePath))) {
      risky_paths_hit = true;
    }
  }

  return { tests_touched, docs_touched, risky_paths_hit };
}
