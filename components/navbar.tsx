"use client";

import Image from "next/image";
import Link from "next/link";
import { GitFork, Github, Menu, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { LANDING_ASSETS } from "@/components/landing/landing-assets";

const RELEASE_VERSION = "2026.5.4";
const GITHUB_REPO = "patchid/func-kode";
const GITHUB_REPO_URL = `https://github.com/${GITHUB_REPO}`;

const NAV_ITEMS = [
  { label: "func(kode)", href: "/#func-kode" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Teams & Platforms", href: "/#for-teams" },
  { label: "For Developers", href: "/#for-developers" },
  { label: "Contact Us", href: "/#contact-us" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [forkCount, setForkCount] = useState<number | null>(null);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    fetch(`https://api.github.com/repos/${GITHUB_REPO}`, {
      headers: { Accept: "application/vnd.github+json" },
    })
      .then((r) => r.json())
      .then((data) => {
        if (typeof data.forks_count === "number") setForkCount(data.forks_count);
      })
      .catch(() => setForkCount(null));
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [close]);

  return (
    <header className="relative z-50 w-full px-5 pt-[41px] sm:px-8 lg:px-[122px]">
      <div className="relative flex min-h-10 items-center justify-between gap-4">
        <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
          <Link href="/" className="relative z-10 shrink-0" onClick={close}>
            <Image
              src={LANDING_ASSETS.logo}
              alt="func(kode) logo"
              width={57}
              height={51}
              className="h-10 w-auto sm:h-[51px]"
              priority
            />
          </Link>

          <span className="hidden shrink-0 rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-xs font-bold tracking-[-0.36px] text-white/90 sm:inline-flex">
            {RELEASE_VERSION}
          </span>

          <nav
            className="hidden items-center gap-6 xl:flex xl:gap-8 2xl:gap-[50px]"
            aria-label="Primary"
          >
            {NAV_ITEMS.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="whitespace-nowrap text-sm font-bold tracking-[-0.56px] text-white transition-opacity hover:opacity-80"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="relative z-10 flex shrink-0 items-center gap-2 sm:gap-3">
          <a
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden overflow-hidden rounded-full border border-white/20 sm:flex"
            aria-label={`GitHub repository — ${forkCount ?? "…"} forks`}
          >
            <span className="flex items-center justify-center bg-white/5 px-3 py-2 text-white">
              <Github className="h-4 w-4" />
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-2 text-sm font-bold text-white">
              <GitFork className="h-3.5 w-3.5 text-[#00C9B7]" />
              {forkCount !== null ? forkCount.toLocaleString() : "—"}
            </span>
          </a>

          <Link
            href="/auth/login"
            className="hidden h-10 items-center justify-center rounded-full bg-white px-5 text-sm font-bold tracking-[-0.42px] text-black transition-opacity hover:opacity-90 sm:inline-flex"
          >
            Connect
          </Link>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:bg-white/10 xl:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        className={`fixed inset-0 z-40 bg-[#040710]/90 backdrop-blur-sm transition-opacity duration-200 xl:hidden ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!open}
        onClick={close}
      >
        <nav
          className={`absolute right-0 top-0 flex h-full w-[min(100%,320px)] flex-col gap-1 bg-[#111B34] px-6 pb-8 pt-24 shadow-2xl transition-transform duration-200 ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
          aria-label="Mobile primary"
          onClick={(e) => e.stopPropagation()}
        >
          <p className="mb-2 px-3 text-xs font-bold uppercase tracking-wider text-white/50">
            {RELEASE_VERSION}
          </p>
          {NAV_ITEMS.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="rounded-lg px-3 py-3 text-base font-bold tracking-[-0.56px] text-white transition-colors hover:bg-white/10"
              onClick={close}
            >
              {label}
            </Link>
          ))}
          <a
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 flex overflow-hidden rounded-full border border-white/20"
            onClick={close}
          >
            <span className="flex items-center justify-center bg-white/5 px-4 py-2.5 text-white">
              <Github className="h-4 w-4" />
            </span>
            <span className="flex flex-1 items-center justify-center gap-1.5 bg-white/10 px-4 py-2.5 text-sm font-bold text-white">
              <GitFork className="h-3.5 w-3.5 text-[#00C9B7]" />
              {forkCount !== null ? forkCount.toLocaleString() : "—"}
            </span>
          </a>
          <Link
            href="/auth/login"
            className="mt-4 inline-flex h-11 items-center justify-center rounded-full bg-white px-6 text-sm font-bold text-black transition-opacity hover:opacity-90"
            onClick={close}
          >
            Connect
          </Link>
        </nav>
      </div>
    </header>
  );
}
