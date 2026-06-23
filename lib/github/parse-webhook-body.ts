/**
 * Parse GitHub webhook body — supports JSON and x-www-form-urlencoded (payload=...).
 * @see https://docs.github.com/en/webhooks/using-webhooks/securing-your-webhooks
 */
export function parseGitHubWebhookBody(
  rawBody: string,
  contentType: string | null,
): Record<string, unknown> {
  const type = contentType?.toLowerCase() ?? "";

  if (type.includes("application/x-www-form-urlencoded")) {
    const params = new URLSearchParams(rawBody);
    const payload = params.get("payload");
    if (!payload) {
      throw new Error("Missing payload field in form-encoded body");
    }
    return JSON.parse(payload) as Record<string, unknown>;
  }

  return JSON.parse(rawBody) as Record<string, unknown>;
}
