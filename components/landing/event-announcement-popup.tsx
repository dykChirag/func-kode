"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { X, PartyPopper } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";

// ── Safe sessionStorage accessors ─────────────────────────────────────────────
// sessionStorage throws in sandboxed iframes and SSR contexts.
// Fail open (return false) so the popup shows when storage is inaccessible.

function getSessionDismissed(key: string): boolean {
  try {
    return sessionStorage.getItem(key) === "true";
  } catch {
    return false;
  }
}

function setSessionDismissed(key: string): void {
  try {
    sessionStorage.setItem(key, "true");
  } catch {
    // Silently ignore — popup will reappear on next load but that is acceptable
  }
}

// ── Types ─────────────────────────────────────────────────────────────────────

/**
 * Config object for EventAnnouncementPopup.
 * Update these fields per event — the component handles the rest.
 *
 * @param enabled        - Set false to hide without removing code. Default: true.
 * @param eventDateIso   - ISO 8601 date string. Popup auto-disables after this date.
 *                         Leave undefined to disable auto-expiry.
 *                         TODO: Set to the actual event end date before going live,
 *                         then flip enabled: false after the event passes.
 */
export interface EventAnnouncementConfig {
  enabled: boolean;
  eventName: string;
  eventDate: string;
  eventDateIso?: string;
  eventDescription: string;
  ctaLabel: string;
  ctaHref: string;
  secondaryLabel?: string;
  delayMs: number;
}

// ── Default config — Server Launch Party ──────────────────────────────────────
// TODO: Fill in eventDateIso and confirm ctaHref Discord link before going live.
// TODO: Set enabled: false after the event passes.

const DEFAULT_CONFIG: EventAnnouncementConfig = {
  enabled: true,
  eventName: "🎉 Server Launch Party",
  eventDate: "Sunday — time TBD (IST)",
  eventDateIso: undefined, // TODO: set to "2026-XX-XXT00:00:00+05:30"
  eventDescription:
    "Join the func-kode Launch Party to kick off the community, meet other developers, explore the server, and hear what's coming next.",
  ctaLabel: "Join the Party 🚀",
  ctaHref: "https://discord.gg/nnkA8xJ3JU",
  secondaryLabel: "Maybe Later",
  delayMs: 1500,
};

const SESSION_DISMISS_KEY = "funkode_event_announcement_dismissed";

// ── Component ─────────────────────────────────────────────────────────────────

interface EventAnnouncementPopupProps {
  config?: Partial<EventAnnouncementConfig>;
}

export function EventAnnouncementPopup({
  config: configOverride,
}: EventAnnouncementPopupProps) {
  const config: EventAnnouncementConfig = { ...DEFAULT_CONFIG, ...configOverride };

  // Auto-expiry: disable after eventDateIso if provided
  const isExpired = config.eventDateIso
    ? Date.now() > new Date(config.eventDateIso).getTime()
    : false;

  const isActive = config.enabled && !isExpired;

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!isActive) return;
    if (getSessionDismissed(SESSION_DISMISS_KEY)) return;

    const timer = setTimeout(() => setOpen(true), config.delayMs);
    return () => clearTimeout(timer);
  }, [isActive, config.delayMs]);

  const handleDismiss = useCallback(() => {
    setOpen(false);
    setSessionDismissed(SESSION_DISMISS_KEY);
  }, []);

  if (!isActive) return null;

  return (
    <Dialog.Root open={open} onOpenChange={(next) => { if (!next) handleDismiss(); }}>
      <Dialog.Portal>
        {/* Backdrop — Radix handles focus trap, scroll lock, and Escape key */}
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300" />

        {/* Modal panel — Radix handles aria-describedby linkage automatically */}
        <Dialog.Content
          className="
            fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2
            bg-card rounded-2xl shadow-2xl border border-border/50
            animate-in zoom-in-95 duration-300 ease-out
            focus:outline-none
            p-0
          "
        >
          {/* Header */}
          <div className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-t-2xl p-6 pb-4">
            {/* Close button — 44px touch target per WCAG 2.5.5 */}
            <Dialog.Close asChild>
              <button
                className="
                  absolute top-2 right-2
                  flex items-center justify-center
                  min-w-[44px] min-h-[44px]
                  rounded-full text-muted-foreground
                  hover:text-foreground hover:bg-muted/80
                  transition-colors
                "
                aria-label="Close announcement"
              >
                <X className="w-4 h-4" />
              </button>
            </Dialog.Close>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/70 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                <PartyPopper className="w-6 h-6 text-white" />
              </div>
              <div>
                <Dialog.Title className="text-xl font-bold text-foreground">
                  {config.eventName}
                </Dialog.Title>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {config.eventDate}
                </p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 pt-4 space-y-5">
            <Dialog.Description className="text-sm text-muted-foreground leading-relaxed">
              {config.eventDescription}
            </Dialog.Description>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Primary — Dialog.Close triggers onOpenChange(false) → handleDismiss */}
              <Dialog.Close asChild>
                <Link
                  href={config.ctaHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    flex-1 inline-flex items-center justify-center gap-2
                    px-5 py-2.5
                    bg-primary text-primary-foreground
                    font-semibold rounded-xl shadow-md
                    hover:opacity-90 hover:shadow-lg
                    transition-all duration-200
                    text-sm
                  "
                >
                  {config.ctaLabel}
                </Link>
              </Dialog.Close>
              <Dialog.Close asChild>
                <button
                  className="
                    flex-1 px-5 py-2.5
                    border border-border bg-background
                    hover:bg-muted
                    text-foreground font-medium rounded-xl
                    transition-colors duration-200
                    text-sm
                  "
                >
                  {config.secondaryLabel ?? "Maybe Later"}
                </button>
              </Dialog.Close>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
