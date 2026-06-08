import type { Logger } from "@opentelemetry/api-logs";

declare global {
  interface PostHogJs {
    __loaded?: boolean;
  }

  var __posthogLogger: Logger | undefined;
}

export {};
