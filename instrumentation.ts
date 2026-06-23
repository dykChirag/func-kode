export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./instrumentation.posthog-logs");
    await import("./instrumentation.pr-events-worker").then((m) =>
      m.registerPrEventsWorker(),
    );
  }
}
